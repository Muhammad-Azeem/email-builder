import React, {Component} from "react";
import '../assets/css/floating-buttons.css';
import {Icon, Tooltip} from "antd";
import {isPreviewRequest} from "./data/actions";
import {isPreview} from "../common/selector";
import {connect} from "react-redux";
import {getPage} from "../common/helpers";

class Actions extends Component {

    _openPreview = () => {
        this.props.isPreviewRequest(true);
    };

    _closePreview = () => {
        this.props.isPreviewRequest(false);
    };

    render() {
        return(
            <React.Fragment>
                <a href="#" className="float-btn">
                    <Icon type="setting" />
                </a>
                <ul id="menu-float">
                    {!this.props.isPreview ? (
                        <li>
                            <Tooltip title="Export" placement="left">
                                <a href="#" onClick={() => getPage(false)}>
                                    <Icon type="export" />
                                </a>
                            </Tooltip>
                        </li>
                    ) : null}
                    <li>
                        {!this.props.isPreview ? (
                            <Tooltip title="Preview" placement="left">
                                <a href="#" onClick={this._openPreview}>
                                    <Icon type="eye" />
                                </a>
                            </Tooltip>
                        ) : (
                            <Tooltip title="Edit" placement="left">
                                <a href="#" onClick={this._closePreview}>
                                    <Icon type="edit" />
                                </a>
                            </Tooltip>
                        )}
                    </li>
                </ul>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isPreview: isPreview(state)
    }
};

const mapDispatchTOProps = {
    isPreviewRequest: isPreviewRequest
};

export default connect(mapStateToProps, mapDispatchTOProps)(Actions);