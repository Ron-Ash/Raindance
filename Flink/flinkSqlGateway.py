import requests
import pandas as pd

import threading
import time

class ReadWriteLock:
    def __init__(self):
        self._cond = threading.Condition()
        self._readers = 0
        self._writer = False

    def acquire_read(self):
        with self._cond:
            self._cond.wait_for(lambda: not self._writer)
            self._readers += 1

    def release_read(self):
        with self._cond:
            self._readers -= 1
            if self._readers == 0:
                self._cond.notify_all()

    def acquire_write(self):
        with self._cond:
            self._cond.wait_for(lambda: not self._writer and self._readers == 0)
            self._writer = True

    def release_write(self):
        with self._cond:
            self._writer = False
            self._cond.notify_all()


class FlinkSQLGateway:
    def __init__(self, sqlgatewayHostname: str, jobmanagerHostname: str):
        self.sqlgatewayHostname = sqlgatewayHostname
        self.jobmanagerHostname = jobmanagerHostname
        self.url = f"http://{self.sqlgatewayHostname}/v1/sessions/"
        session = requests.post(self.url)
        session.raise_for_status()
        self.session = session.json()["sessionHandle"]
        self.ops = []

        self.rwlock = ReadWriteLock()
        self.jobs = self.get_jobs()
    
    def send_operation(self, payload: dict, sleepTime: int, headers: dict={"Content-Type": "application/json"}):
        url = f"{self.url}{self.session}/statements"
        operation = requests.post(url, json=payload, headers=headers)
        operation.raise_for_status()
        operation = operation.json()["operationHandle"]
        time.sleep(sleepTime)
        print(self.check_operation_status(operation))
        newJobs = self.update_jobs()
        if len(newJobs) > 1:
            raise ValueError("ambiguous operation created: >1 jobs.")
        return operation, newJobs
    
    def get_jobs(self):
        url = f"http://{self.jobmanagerHostname}/jobs"
        status = requests.get(url)
        status.raise_for_status()
        jobs = {job["id"]: job["status"] for job in status.json().get("jobs", [])}
        return jobs
    
    def update_jobs(self):
        self.rwlock.acquire_write()
        jobs = self.get_jobs()
        newJobs = list(set(jobs.keys()) - set(self.jobs.keys()))
        self.jobs.update(jobs)
        self.rwlock.release_write()
        return newJobs

    def check_operation_status(self, operationHandle: str):
        url = f"{self.url}{self.session}/operations/{operationHandle}/status"
        status = requests.get(url)
        status.raise_for_status()
        return status.json()["status"]
    
    def fetch_operation_results(self, operationHandle: str, nextResultURi: str=None):
        batches = []
        if nextResultURi is None:
            url = f"{self.url}{self.session}/operations/{operationHandle}/result/0"
        else:
            url = f"http://{self.sqlgatewayHostname}{nextResultURi}"

        while True:
            data = requests.get(url)
            print(url)
            data.raise_for_status()
            data = data.json()
            batches.append(data)
            nextResultURi = data.get("nextResultUri", None)
            if len(data.get("results",{}).get("data",[])) <= 0 or nextResultURi is None:
                break
            url = f"http://{self.sqlgatewayHostname}{nextResultURi}"

        dfs = []
        for batch in batches:
            data = batch.get("results",{})
            columns = [column.get("name", "") for column in data.get("columns", [])]
            data = [row.get("fields", []) for row in data.get("data", [])]
            df = pd.DataFrame(data, columns=columns)
            dfs.append(df)
        return pd.concat(dfs, ignore_index=True), nextResultURi