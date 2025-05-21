
import pandas as pd
import clickhouse_connect
import networkx as nx
import os

def predecessor_chain(G, levels=2):
    reach = {node: {node} for node in G.nodes}
    frontier = [reach]
    for i in range(levels):
        print(".", end="")
        frontier.append({k: set().union(*[set(G.predecessors(node)) for node in v]).difference(reach[k]) for k,v in frontier[-1].items()})
        reach = {k: v.union(frontier[-1][k]) for k,v in reach.items()}
    return reach

def successor_chain(G, levels=2):
    reach = {node: {node} for node in G.nodes}
    frontier = [reach]
    for i in range(levels):
        print(".", end="")
        frontier.append({k: set().union(*[set(G.successors(node)) for node in v]).difference(reach[k]) for k,v in frontier[-1].items()})
        reach = {k: v.union(frontier[-1][k]) for k,v in reach.items()}
    return reach

def close_g2_graphlets(G, idMap):
    reversedIMap = {v: k for k, v in idMap.items()}
    n2 = successor_chain(G, levels=2)
    n1 = successor_chain(G, levels=1)
    return {reversedIMap[k]: [reversedIMap[node] for node in n2[k].difference(n1[k])] for k in n2.keys()}

def following_mutuals(G, idMap):
    reversedIMap = {v: k for k, v in idMap.items()}
    n1 = successor_chain(G, levels=1)
    n1_ = predecessor_chain(G,1)
    n2_ = {k: set().union(*[set(G.predecessors(node)) for node in v]) for k,v in n1.items()}
    return {reversedIMap[k]: [reversedIMap[node] for node in n2_[k].union(n1_[k]).difference(n1[k])] for k in n2_.keys()}

if __name__ == "__main__":
    client = clickhouse_connect.get_client(host=os.getenv("CLICKHOUSE_HOST", 'localhost'), port=8123, username=os.getenv("CLICKHOUSE_USER", 'user'), password=os.getenv("CLICKHOUSE_PASSWORD",'password'))
    dfs_stream = client.query_df_stream('SELECT `user`, `follows` from socialNetwork_followers FINAL;')
    dfs = []
    with dfs_stream:
        for df in dfs_stream:
            dfs.append(df)
    df = pd.concat(dfs, ignore_index=True)   

    combined = pd.concat([df['user'], df['follows']], ignore_index=True)
    codes, uniques = pd.factorize(combined)
    idMap = {val: code for code, val in enumerate(uniques)}
    n = len(df)
    df['user_code'] = codes[:n]
    df['follows_code'] = codes[n:]
    edges = df[['user_code', 'follows_code']].to_records(index=False).tolist()

    G = nx.DiGraph()
    G.add_edges_from(edges)
    
    mutuals = {k: list(v) for k, v in following_mutuals(G, idMap).items()}
    recommended = {k: list(v) for k, v in close_g2_graphlets(G, idMap).items()}
    client.insert('socialNetwork_friendRecommendation', list(recommended.items()), column_names=['user', 'recommendations'])
    client.close()
