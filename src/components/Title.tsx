import { CurrentListTitle } from "../types";

interface TitleProps {
    currentTitle: CurrentListTitle;
    currentCount: number;
}

const Title = ({ currentTitle, currentCount }: TitleProps) => {
    return (
        <header>
            <label htmlFor="sidebar_toggle">
                <img src="images/hamburger.png" alt="Toggle Sidebar" />
            </label>
            <dl>
                <dt><time>{currentTitle.title}</time></dt>
                <dd>{currentCount}</dd>
            </dl>
        </header>
    )
}

export default Title;