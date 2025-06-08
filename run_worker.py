from rq import Worker, Connection
from redis import Redis
import os

# use same REDIS_URL as tasks module
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")


def main():
    conn = Redis.from_url(redis_url)
    with Connection(conn):
        worker = Worker(['default'])
        worker.work()


if __name__ == '__main__':
    main()

