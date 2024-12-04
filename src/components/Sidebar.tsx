type DueDates = {
    [key: string]: number,
}

interface SidebarProps {
    totalCount: number;
    totalCounts: DueDates;
    completedCount: number;
    completedCounts: DueDates;
    handleListClick: (title: string, completedOnly: boolean) => void;
}

const Sidebar = ({totalCount, totalCounts, completedCount, completedCounts, handleListClick}: SidebarProps) => {
    return (
        <div id="sidebar" >
        <section id="all">
          <div id="all_todos">
            <header data-title="All Todos" data-total={totalCount} id="all_header" onClick={() => handleListClick("All Todos", false)}>
                <dl>
                    <dt>All Todos</dt>
                    <dd>{totalCount}</dd>
                </dl>
            </header>
          </div>
          <article id="all_lists">
            {Object.entries(totalCounts).map(([dueDate, count]) => {
                return (
                    <dl data-title={dueDate} data-total={count} key={dueDate} onClick={() => handleListClick(dueDate, false)}>
                        <dt><time>{dueDate}</time></dt>
                        <dd>{count}</dd>
                    </dl>
                )}
                )
            }
          </article>
        </section>
        <section className="completed" id="completed_items">
          <div id="completed_todos">
            <header data-title="Completed" data-total={completedCount} id="all_done_header" onClick={() => handleListClick("Completed", true)}>
                <dl>
                    <dt>Completed</dt>
                    <dd>{completedCount}</dd>
                </dl>
            </header>
          </div>
          <article id="completed_lists">
            {Object.entries(completedCounts).map(([dueDate, count]) => {
                return (
                    <dl data-title={dueDate} data-total={count} key={dueDate} onClick={() => handleListClick(dueDate, true)}>
                        <dt><time>{dueDate}</time></dt>
                        <dd>{count}</dd>
                    </dl>
                )}
                )
            }
          </article>
        </section>
      </div>
    )
}

export default Sidebar;