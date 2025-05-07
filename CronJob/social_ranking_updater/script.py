import clickhouse_connect
import pandas as pd
import numpy as np
import os

def adjacency_matrix(df: pd.DataFrame, column1: str, column2: str):
    adjacency = pd.crosstab(df[column1], df[column2])
    idx = adjacency.columns.union(adjacency.index)
    adjacency = adjacency.reindex(index = idx, columns=idx, fill_value=0)
    return adjacency

def pagerank_power_iteration(M, R, V, beta, epsilon):
    while True:
        r = beta*(R@M) +V
        difference = np.abs(r-R).sum()
        print(".", end="")
        if difference < epsilon:
            break
        R = r
    print("")
    return r

def pagerank_from_nothing(adjacency: pd.DataFrame, beta: float, epsilon: float=0.00001):
    lenV = len(adjacency.columns)
    M = adjacency.div(adjacency.sum(axis=1), axis=0).replace([np.inf, -np.inf], np.nan).fillna(0).to_numpy()
    R = pd.DataFrame(1/lenV, index=['rank'], columns=adjacency.columns).to_numpy()
    V = (1-beta) * R.copy()
    return pd.DataFrame(pagerank_power_iteration(M, R, V, beta, epsilon), index=['rank'], columns=adjacency.columns)

def pagerank_from_previous(adjacency: pd.DataFrame, csvPath: str, beta: float, epsilon: float=0.00001):
    previousRank = pd.read_csv(csvPath, index_col=0)
    indxs = previousRank.columns.union(adjacency.columns)
    print(len(previousRank.columns), len(adjacency.columns), len(indxs))
    adjacency = adjacency.reindex(index=indxs, columns=indxs, fill_value=0)

    lenV = len(indxs)
    M = adjacency.div(adjacency.sum(axis=1), axis=0).replace([np.inf, -np.inf], np.nan).fillna(0).to_numpy()
    R = (previousRank * len(previousRank.columns) / lenV).reindex(index=['rank'], columns=indxs, fill_value=1/lenV).to_numpy()
    V = pd.DataFrame((1-beta)/lenV, index=['rank'], columns=adjacency.columns).to_numpy()
    return pd.DataFrame(pagerank_power_iteration(M, R, V, beta, epsilon), index=['rank'], columns=indxs)

if __name__ == "__main__":
    csvPath = f"{'.'}/rank.csv"
    beta = 0.9
    client = clickhouse_connect.get_client(host='localhost', port=8123, username='user', password='password')

    dfs_stream = client.query_df_stream('SELECT user, follows from socialNetwork_followers;')
    adjacencies = []
    with dfs_stream as dfs:
        for df in dfs:
            adjacencies.append(adjacency_matrix(df, 'user', 'follows'))
        indxs = pd.Index(np.unique(np.concatenate([df.columns for df in adjacencies])))

    for adj in adjacencies:
        adj = adj.reindex(index=indxs, columns=indxs, fill_value=0)
    adjacency = sum(adjacencies[1:], adjacencies[0].copy())
    if os.path.isfile(csvPath):
        rank = pagerank_from_previous(adjacency, csvPath, beta)
    else:
        rank = pagerank_from_nothing(adjacency, beta)
    rank.to_csv(csvPath)
    rank = rank.T
    rank.reset_index(names="user", inplace=True)
    client.insert_df("socialNetwork_popularity", rank)
    client.close()