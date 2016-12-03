import React, { Component } from 'react';

const Blurb = ({ emoji, text, size = "" }) => (
    <div className="blurb">
        <div className="title">{emoji}</div>
        <div className={size}>{text}</div>
    </div>
);
const insides = {
    default: {
        text: "Contract software engineer in London, currently helping The Trainline (via YLD) replatform their frontend experience, using Typescript, React, Redux, and Node.",
        emoji: "🚋",
        url: "/"
    },
    skybet: {
        text: "I joined Sky Betting & Gaming to help them rebuild and modernise their frontend stack. Using technology such as React, Redux, ImmutableJS, Webpack, and Node.js.\nI worked on rebuilding existing parts of the website with React, as well as building reusable components for a company wide ui-library. To make a full component slice I also advised on API response structure to best fit the consumption on the client.",
        emoji: "⚽️",
        id: "sbg",
        size: "smaller",
        href: "https://m.skybet.com",
        title: "Sky Betting & Gaming",
        url: "/work/skybet"
    },
    laterooms: {
        text: "While at Laterooms.com, I worked on two re-platforming projects. Both of these projects were built fully responsively and mobile first, ensuring that there was no need for a mobile website any more. The other important factor was to make the code base easy to change, quick to deploy to live, and be smart enough to fail this process if there was an issue.",
        emoji: "🏨",
        id: "lr",
        size: "smaller",
        href: "http://laterooms.com",
        title: "Laterooms.com",
        url: "/work/laterooms"
    },
    saa: {
        title: "Sane & Able",
        href: "http://saneandable.co.uk"
    },
    pkd: {
        title: "PKD",
        href: "http://pkd.co.uk"
    }
}

class App extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        const id = window.location.pathname.replace(/.+\//g, '') || 'default';
        if ((insides[id] || {}).text) {
            this.state = { id };
        } else {
            this.state = { id: 'default' }
            window.history.replaceState({ id: 'default' }, '', '/');
        }
    }

    handleClick(e, id) {
        if (insides[id].text) {
            e.preventDefault();
        } else {
            return;
        }
        this.setState({ id });
        window.history.pushState({ id }, id, insides[id].url || id)
    }

    componentDidMount() {
        window.addEventListener('popstate', e => this.setState({
            id: (e.state || { id: 'default' }).id
        }));
    }

    render() {
        const { id } = this.state;
        const { emoji, text, size } = insides[id];
        return (<div>
            <h1><span className="title">{ id !== 'default' ? <a href="#" onClick={e => this.handleClick(e, 'default')}>←</a> : '🐵'}</span>Will Monk </h1>

            <Blurb text={text} emoji={emoji} size={size} />

            <div className="previous">
                <div className="title">🎉</div>
                <div>
                    Previously at: &nbsp;
                    {Object.keys(insides).slice(1).map(insideId => {
                        const { href, title, id: cx = insideId } = insides[insideId];
                        return (<a href={href} onClick={e => this.handleClick(e, insideId)} className={`${cx} ${id === insideId && "selected"}`} target="_blank">{title}</a>);
                    }).reduce((arr, link, i) => {
                        if (!Array.isArray(arr)) {
                            return [arr, <span>,&nbsp;</span>, link];
                        }
                        return [...arr, <span>,&nbsp;</span>, link];
                    })}
                </div>
            </div>
        </div>);
    }
}

export default App;
