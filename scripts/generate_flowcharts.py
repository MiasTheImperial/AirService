"""Utility to generate backend algorithm flowcharts using Graphviz."""
from graphviz import Digraph


def create_order_flowchart(filename: str = "order_flowchart") -> None:
    """Generate a flowchart of the order creation process."""
    dot = Digraph("OrderCreation", format="png")
    dot.attr(rankdir="TB", fontsize="12")

    dot.node("start", "Начало", shape="ellipse")
    dot.node("validate", "Валидация данных", shape="rectangle")
    dot.node("auth", "Проверка\nаутентификации", shape="diamond")
    dot.node("auth_fail", "401", shape="rectangle")
    dot.node("idem", "Есть идемпотентный\nключ?", shape="diamond")
    dot.node("existing", "Вернуть существующий\nзаказ", shape="rectangle")
    dot.node("save", "Сохранить заказ", shape="rectangle")
    dot.node("event", "Отправить событие", shape="rectangle")
    dot.node("end", "Отправить ответ", shape="ellipse")

    dot.edge("start", "validate")
    dot.edge("validate", "auth")
    dot.edge("auth", "auth_fail", label="нет")
    dot.edge("auth", "idem", label="да")
    dot.edge("idem", "existing", label="да")
    dot.edge("idem", "save", label="нет")
    dot.edge("existing", "end")
    dot.edge("save", "event")
    dot.edge("event", "end")

    dot.render(filename, cleanup=True)


def sse_notifications_flowchart(filename: str = "sse_flowchart") -> None:
    """Generate a flowchart for SSE notification pipeline."""
    dot = Digraph("SSENotifications", format="png")
    dot.attr(rankdir="TB", fontsize="12")

    dot.node("start", "Событие заказа", shape="ellipse")
    dot.node("push", "push_event", shape="rectangle")
    dot.node("queue", "Очередь событий", shape="rectangle")
    dot.node("client", "Клиент /notifications", shape="rectangle")
    dot.node("send", "Отправка данных", shape="rectangle")
    dot.node("end", "Конец", shape="ellipse")

    dot.edge("start", "push")
    dot.edge("push", "queue")
    dot.edge("client", "queue")
    dot.edge("queue", "send")
    dot.edge("send", "client")
    dot.edge("send", "end")

    dot.render(filename, cleanup=True)


def catalog_flowchart(filename: str = "catalog_flowchart") -> None:
    """Generate a flowchart for catalog retrieval."""
    dot = Digraph("Catalog", format="png")
    dot.attr(rankdir="TB", fontsize="12")

    dot.node("start", "Запрос /catalog", shape="ellipse")
    dot.node("filters", "Чтение параметров\nфильтра", shape="rectangle")
    dot.node("query", "Формирование\nзапроса", shape="rectangle")
    dot.node("convert", "Преобразование\nданных", shape="rectangle")
    dot.node("end", "Ответ", shape="ellipse")

    dot.edge("start", "filters")
    dot.edge("filters", "query")
    dot.edge("query", "convert")
    dot.edge("convert", "end")

    dot.render(filename, cleanup=True)


def integration_flowchart(filename: str = "integration_flowchart") -> None:
    """Generate a flowchart for integration tasks."""
    dot = Digraph("Integration", format="png")
    dot.attr(rankdir="TB", fontsize="12")

    dot.node("start", "POST /integration/*", shape="ellipse")
    dot.node("save", "Создать\nOutgoingMessage", shape="rectangle")
    dot.node("enqueue", "task_queue.enqueue", shape="rectangle")
    dot.node("worker", "process_outgoing_message", shape="rectangle")
    dot.node("mark", "Пометить\nкак отправленное", shape="rectangle")
    dot.node("end", "Конец", shape="ellipse")

    dot.edge("start", "save")
    dot.edge("save", "enqueue")
    dot.edge("enqueue", "worker")
    dot.edge("worker", "mark")
    dot.edge("mark", "end")

    dot.render(filename, cleanup=True)


def admin_update_flowchart(filename: str = "admin_update_flowchart") -> None:
    """Generate a flowchart for admin updating order status."""
    dot = Digraph("AdminUpdate", format="png")
    dot.attr(rankdir="TB", fontsize="12")

    dot.node("start", "PATCH /admin/orders", shape="ellipse")
    dot.node("auth", "auth_required", shape="rectangle")
    dot.node("find", "Поиск заказа", shape="rectangle")
    dot.node("not_found", "404", shape="rectangle")
    dot.node("update", "Изменить статус", shape="rectangle")
    dot.node("event", "push_event", shape="rectangle")
    dot.node("end", "Ответ", shape="ellipse")

    dot.edge("start", "auth")
    dot.edge("auth", "find")
    dot.edge("find", "not_found", label="нет")
    dot.edge("find", "update", label="да")
    dot.edge("update", "event")
    dot.edge("event", "end")

    dot.render(filename, cleanup=True)


if __name__ == "__main__":
    create_order_flowchart()
    sse_notifications_flowchart()
    catalog_flowchart()
    integration_flowchart()
    admin_update_flowchart()
