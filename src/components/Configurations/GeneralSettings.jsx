import React, {Component} from "react";
import {generalSettings, itemsData} from "../../common/selector";
import {isEditItemRequest, generalSettingsRequest} from "../data/actions";
import {connect} from "react-redux";
import {Input, InputNumber, Select} from "antd";
import ColorPicker from "rc-color-picker";
import {FONT_FAMILIES, FONT_SIZES} from "../../common/constants";
import _ from "lodash";
import {formatColorValue} from "../../common/helpers";

class GeneralSettings extends Component{
    constructor(props) {
        super(props);
        this.state = {
            buttonSettings: props.generalSettings.button,
        }
    }

    componentDidMount() {
        this.props.isEditItemRequest(null);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!_.isEqual(prevProps.generalSettings.button, this.props.generalSettings.button) )
        {
            console.log(this.props.generalSettings);
            this.setState({buttonSettings: this.props.generalSettings.button})
        }
    }

    _updateStyle = (option, value) => {
        const settings = {...this.props.generalSettings};
        settings.button[option] = value;
        this.props.generalSettingsRequest(settings);
    };

    render() {
        return  (<React.Fragment>
            <div className="form-group col-12 mb-2" key={'color'}>
                <label style={{width: '100%'}}>Color</label>
                <ColorPicker
                    className="w-100"
                    animation="slide-up"
                    color={this.state.buttonSettings.color}
                    onChange={(e) => this._updateStyle('color', formatColorValue(e))}
                />
            </div>

            <div className="form-group col-12 mb-2" key={'fontSize'}>
                <label>Font Size </label>
                <div className="input-group input-group-sm">
                    <input className="form-control" type="number"
                           min={8} max={36}
                           value={this.state.buttonSettings.fontSize.split('px')[0]}
                           onChange={e => this._updateStyle('fontSize', e.target.value + 'px')}/>
                    <div className="input-group-append">
                        <span className="input-group-text">px</span>
                    </div>
                </div>
            </div>

            <div className="form-group col-12 mb-2" key={'fontFamily'}>
                <label>Font Family</label>
                <select className="form-control form-control-sm"
                        value={this.state.buttonSettings.fontFamily}
                        onChange={e => this._updateStyle('fontFamily', e.target.value)}>
                    {Object.keys(FONT_FAMILIES).map(f => {
                        return <option key={f} value={f}>
                            {FONT_FAMILIES[f]}</option>;
                    })}
                </select>
            </div>

        </React.Fragment>);

    }
}

function mapStateToProps(state) {
    return {
        generalSettings: generalSettings(state)
    }
}

const mapDispatchToProps = {
    generalSettingsRequest: generalSettingsRequest,
    isEditItemRequest: isEditItemRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneralSettings);
