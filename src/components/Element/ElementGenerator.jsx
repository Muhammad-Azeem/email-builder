import React, {Component} from "react";
import {generalSettings, itemsData} from "../../common/selector";
import {isEditItemRequest} from "../data/actions";
import {connect} from "react-redux";
import '../../assets/css/image-box.css';
import {IMAGE_PLACEHOLDER} from "../../common/constants";
import ReactHtmlParser from 'react-html-parser';

class ElementGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elementType: props.type,
            settings: props.settings,
            elementId: props.elementId,
        };
    }

    componentDidMount() {
        this.props.isEditItemRequest(this.state.elementId);
        this._loadSettings();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.generalSettings && prevProps.generalSettings !== this.props.generalSettings) {
            this._loadSettings();
            this.setState({loading: false})
        }
    }

    _editElement = () => {
        this.props.isEditItemRequest(this.state.elementId);
    };

    _loadSettings = () => {
        if (this.props.settings.style.hasOwnProperty('fontSize'))
            this._isElementSettingExist('fontSize', this.state.settings.style.fontSize);
        if (this.props.settings.style.hasOwnProperty('fontFamily'))
            this._isElementSettingExist('fontFamily', this.state.settings.style.fontFamily);
        if (this.props.settings.style.hasOwnProperty('color'))
            this._isElementSettingExist('color', this.state.settings.style.color);
    };

    _isElementSettingExist = (option, value) => {
        const style = {...this.props.settings.style};
        style[option] = this.props.generalSettings.button[option];
        this.state.settings.style = style;
    };

    _renderElement = (settings) => {
        let node = null;

        switch (this.state.elementType) {
            case 'button':
                node = (
                    <a href={this.state.settings.style.link ? this.state.settings.style.link : '#'}
                       style={{textDecoration: 'none', color: this.state.settings.style.color}}
                       target={this.state.settings.style.link && '_blank'} className="hasLink">
                        <button style={this.state.settings.style} onClick={this._editElement} id={this.state.elementId}>
                            <div style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                {this.state.settings.label}
                            </div>
                        </button>
                    </a>
                );
                break;
            case 'text':
                node = (
                    <div name="text" id={this.state.elementId}
                         style={{display: 'inline-block', height: '100%', width: '100%'}}
                         onClick={this._editElement}>
                        <span style={settings.style}>{ReactHtmlParser(settings.label)}</span>
                    </div>
                );
                break;
            case 'image':
                const style = {...this.state.settings.style};
                style.backgroundImage = `url('${this.state.settings.imageUrl ? this.state.settings.imageUrl : IMAGE_PLACEHOLDER}')`;
                style.backgroundSize = '100% 100%';
                node =
                    <a href={this.state.settings.style.link ? this.state.settings.style.link : '#'}
                       style={{textDecoration: 'none', color: this.state.settings.style.color}}
                       target={this.state.settings.style.link && '_blank'} className="hasLink">
                        <div style={style} onClick={this._editElement}/>
                    </a>;
                break;
            case 'divider':
                node = (
                    <div style={this.state.settings.style} onClick={this._editElement} />
                );
                break;


            default:
                break;

        }
        return node;
    };

    render() {
        return (
            this._renderElement(this.props.settings)
        )
    }
}

function mapStateToProps(state) {
    return {
        items: itemsData(state),
        generalSettings: generalSettings(state)
    }
}

const mapDispatchToProps = {
    isEditItemRequest: isEditItemRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(ElementGenerator);
