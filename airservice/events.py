from queue import Queue

subscribers = []


def push_event(data):
    for q in list(subscribers):
        q.put(data)


def register_queue():
    q = Queue()
    subscribers.append(q)
    return q


def unregister_queue(q):
    try:
        subscribers.remove(q)
    except ValueError:
        pass
