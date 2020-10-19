import React, {Component} from "react";
import ReactHtmlParser from "react-html-parser";
import {Icon} from "antd";
import "../assets/css/preview-screens.css";

export default class PreviewTemplate extends Component{
    constructor(props) {
        super(props);

        this.state = {
            screen: "desktop"
        };
    }

    _handleClick = (event) => {
        this.setState({
            screen: event.currentTarget.name
        });
    };

    render() {
        return (
            <React.Fragment>
                <div className="float-preview-btn">
                    <a href="#" className={this.state.screen === "desktop" ? "active" : ""}
                       onClick={this._handleClick} name="desktop">
                        <Icon type="desktop" />
                    </a>
                    <a href="#" className={this.state.screen === "tablet" ? "active" : ""}
                       onClick={this._handleClick} name="tablet">
                        <Icon type="tablet" />
                    </a>
                    <a href="#" className={this.state.screen === "mobile" ? "active" : ""}
                       onClick={this._handleClick} name="mobile">
                        <Icon type="mobile" />
                    </a>
                </div>
                <div className={this.state.screen}>
                    <div className="content">
                        <iframe srcDoc={this.props.template}
                                style={{width: '100%', height: '100%', border: 'none'}} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}