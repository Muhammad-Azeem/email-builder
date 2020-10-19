import React, {Component} from "react";
import {connect} from "react-redux";
import {editItem, itemsData} from "../../common/selector";
import {Tooltip, Radio, Empty, Icon, Input, message, TextArea, Upload} from "antd";
import {isEditItemRequest, isItemsRequest} from "../data/actions";
import {FONT_FAMILIES} from "../../common/constants";
import 'rc-color-picker/assets/index.css';
import ColorPicker from 'rc-color-picker';
import '../../assets/css/element-settings.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {camelToTitleCase, formatColorValue} from "../../common/helpers";

class ElementSetting extends Component {

    constructor(props) {
        super(props);

        this.state = {
            element: null,
            text: ''
        };
    }

    componentWillMount() {
        this._getElement();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.props.items && prevProps.items !== this.props.items) ||
            (prevProps.editItem !== this.props.editItem)) {
            this._getElement();
            this.setState({test: true});
        }
    }

    _getElement = () => {
        const element = this.props.items.find(i => i.i === this.props.editItem);
        if (element) {
            this.setState({
                element: element,
                loading: null,
            });
        }
    };

    _renderOption = (option, value) => {
        switch (option) {
            case 'color':
                return (
                    <div className="form-group col-6 mb-2 p-0 float-lg-right" key={option}>
                        <label style={{width: '100%'}}>{camelToTitleCase(option)}</label>
                        <ColorPicker
                            className="w-100"
                            animation="slide-up"
                            color={value}
                            name={option}
                            onChange={(e) => this._updateStyle(option, formatColorValue(e))}/>
                    </div>
                );
            case 'background':
                return (
                    <div className="form-group col-6 mb-2 p-0" key={option}>
                        <label style={{width: '100%'}}>{camelToTitleCase(option)}</label>
                        <ColorPicker
                            className="w-100"
                            animation="slide-up"
                            color={value}
                            name={option}
                            onChange={(e) => this._updateStyle(option, formatColorValue(e))}/>
                    </div>
                );
            case 'fontSize':
                return (
                    <div className="form-group col-12 mb-2 p-0" key={option}>
                        <label>{camelToTitleCase(option)}</label>
                        <div className="input-group input-group-sm">
                            <input className="form-control" type="number"
                                   min={8} max={36}
                                   value={value.split('px')[0]}
                                   onChange={e => this._updateStyle(option, e.target.value + 'px')}/>
                            <div className="input-group-append">
                                <span className="input-group-text">px</span>
                            </div>
                        </div>
                    </div>
                );
            case 'fontFamily':
                return (
                    <div className="form-group col-12 mb-2 p-0" key={option}>
                        <label>{camelToTitleCase(option)}</label>
                        <select className="form-control form-control-sm"
                                value={value}
                                onChange={e => this._updateStyle(option, e.target.value)}>
                            {Object.keys(FONT_FAMILIES).map(f => {
                                return <option key={f} value={f}>
                                    {FONT_FAMILIES[f]}</option>;
                            })}
                        </select>
                    </div>
                );
            case 'textAlign':
                return (
                    <div className="form-group col-12 mb-2 p-0" key={option}>
                        <label>{camelToTitleCase(option)}</label>
                        <Radio.Group value={value} className="d-block" onChange={e => this._updateStyle(option, e.target.value)}>
                            <Tooltip title="Left">
                                <Radio.Button value="left">
                                    <Icon type="align-left" />
                                </Radio.Button>
                            </Tooltip>
                            <Tooltip title="Center">
                                <Radio.Button value="center">
                                    <Icon type="align-center" />
                                </Radio.Button>
                            </Tooltip>
                            <Tooltip title="Right">
                                <Radio.Button value="right">
                                    <Icon type="align-right" />
                                </Radio.Button>
                            </Tooltip>
                        </Radio.Group>
                    </div>
                );
            case 'link':
                return (
                    <div className="form-group col-12 mb-2 p-0" key={option}>
                        <label>{camelToTitleCase(option)}</label>
                        <input type="text" className="form-control"
                               name={option} value={value}
                               placeholder={'https://example.com'}
                               onChange={(e) => this._updateStyle(option, e.target.value)}/>
                    </div>
                );
            case 'imageSize':
            default:
                return null;
        }
    };

    _renderStyleSettings = () => {
        const styles = this.state.element.settings.style;
        return Object.keys(styles).map(s => {
            const option = this._renderOption(s, styles[s]);
            if (option) {
                return option;
            }
        });
    };

    _updateSetting = (option, value) => {
        const items = this.props.items.map(y => {
            if (y.i === this.props.editItem) {
                let obj = {...y};
                let settings = obj.settings;
                settings[option] = value;
                obj.settings = settings;
                return obj;
            }
            return y;
        });
        this.props.isItemsRequest(items);
    };

    _updateStyle = (option, value) => {
        const items = [...this.props.items].map(y => {
            if (y.i === this.props.editItem) {
                const styles = {...y.settings.style};
                styles[option] = value;
                y.settings.style = styles;
            }
            return y;
        });
        this.props.isItemsRequest(items);
    };

    beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            let url = '';
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }, this._updateImageSettings),
            );
        }
    };

    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    _updateImageSettings = () => {
        const items = [...this.props.items].map(y => {
            if (y.i === this.props.editItem) {
                y.settings.imageUrl = this.state.imageUrl;
            }
            return y;
        });
        this.props.isItemsRequest(items);
    };

    _handleEditorChange = (value) => {
        this._updateSetting('label', value);
    };

    render() {
        const uploadButton = (
            <div style={{width: '100%'}}>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        const modules = {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{'list': 'ordered'}, {'list': 'bullet'}],
                ['link', 'clean'],
            ],
        };

        switch (this.state.element.type) {
            case 'button':
                return (
                    <React.Fragment>
                        <div className="form-group col-12 mb-2 p-0 mt-2">
                            <label>Text</label>
                            <Input placeholder="Label" className="form-control"
                                   value={this.state.element.settings.label}
                                   name="label" onChange={(e) => this._updateSetting('label', e.target.value)}/>
                        </div>
                        {this._renderStyleSettings()}
                    </React.Fragment>);
            case 'divider':
                return (
                    <React.Fragment>
                        {this._renderStyleSettings()}
                    </React.Fragment>);
            case 'text':
                return (<React.Fragment>
                    <div className="form-group col-12 mb-2 p-0 mt-2">
                        {/*<label>Text</label>*/}
                        <ReactQuill value={this.state.element.settings.label}
                                    modules={modules}
                                    style={{
                                        minHeight: '6rem'
                                    }}
                                    onChange={this._handleEditorChange}/>
                        {/*<TextArea name="label" rows={4} onChange={(e) => this._updateSetting('label', e.target.value)} value={this.state.element.settings.label} />*/}
                    </div>
                    {this._renderStyleSettings()}
                </React.Fragment>);

            case 'image':
                return (<React.Fragment>
                    <div className="form-group col-12 mb-2 p-0 mt-2">
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={this.beforeUpload}
                            onChange={this.handleChange}
                        >
                            {uploadButton}
                        </Upload>
                    </div>
                    {this._renderStyleSettings()}
                </React.Fragment>);
            default :
                return (
                    <React.Fragment>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                               description={<span className="text-white">Select an Element To Edit Settings</span>}/>
                    </React.Fragment>
                )
        }
    }
}

function mapStateToProps(state) {
    return {
        items: itemsData(state),
        editItem: editItem(state)
    }
}

const mapDispatchToProps = {
    isItemsRequest: isItemsRequest,
    isEditItemRequest: isEditItemRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(ElementSetting);
