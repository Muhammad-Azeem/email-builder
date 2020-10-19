import React, {Component} from 'react';
import './App.css';
import {Layout, Icon, Card, Button, Tooltip} from 'antd';
import {connect} from "react-redux";
import _ from "lodash";
import '../assets/css/react-grid-layout.css';
import '../assets/css/react-resizable.css';
import '../assets/css/react-droppable.css';
import RGL, {WidthProvider} from "react-grid-layout";
import {isEditItemRequest, isItemsRequest, generalSettingsRequest} from "./data/actions";
import {editItem, generalSettings, isPreview, itemsData} from "../common/selector";
import ElementGenerator from "./Element/ElementGenerator";
import ElementSetting from "./Element/ElementSetting";
import {FONT_FAMILIES} from "../common/constants";
import GeneralSettings from "./Configurations/GeneralSettings";
import Actions from "./Actions";
import {getPage} from "../common/helpers";
import PreviewTemplate from "./PreviewTemplate";

const ReactGridLayout = WidthProvider(RGL);
const {Sider, Content} = Layout;

class App extends Component {
    static defaultProps = {
        className: "layout",
        cols: 48,
        rowHeight: 5,
        compactType: null,
        margin: [2, 2],
        containerPadding: [4, 0]
    };

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            currentDrop: null,
            newCounter: 0,
            key: 'content',
            template: null
        };
    }

    _onTabChange = (key, type) => {
        this.setState({[type]: key});
    };

    componentDidMount() {
        this.props.isItemsRequest([]);
        this.props.generalSettingsRequest({
            'button': {
                'fontSize': '12px',
                'fontFamily': 'sans-serif',
                'color': '#000000',
            },
            'text': {
                'fontSize': '12px',
                'fontFamily': 'sans-serif',
                'color': '#000000',
            }

        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isPreview !== this.props.isPreview) {
            this._showPreview();
        }

        if (this.props.items && prevProps.items !== this.props.items) {
            this._renderElements(this.props.generalSettings, this.props.items);
        }
    }

    _createElement = (el) => {
        return (
            <div key={el.i} data-grid={el}>
                <ElementGenerator type={el.type} settings={el.settings} elementId={el.i}/>
            </div>
        );
    };

    _onDrop = (elemParams) => {
        const self = this;
        let hasDrop = setInterval(function () {
            if (self.state.currentDrop) {
                let items = [...self.props.items];
                items.push({
                    i: "n" + self.state.newCounter,
                    x: elemParams.x,
                    y: elemParams.y,
                    w: self.state.currentDrop.hasAttribute('minw')
                        ? parseInt(self.state.currentDrop.getAttribute('minw')) : elemParams.w,
                    h: self.state.currentDrop.hasAttribute('minh')
                        ? parseInt(self.state.currentDrop.getAttribute('minh')) : elemParams.h,
                    minW: self.state.currentDrop.hasAttribute('minw')
                        ? parseInt(self.state.currentDrop.getAttribute('minw')) : 0,
                    maxW: self.state.currentDrop.hasAttribute('maxw')
                        ? parseInt(self.state.currentDrop.getAttribute('maxw')) : Infinity,
                    minH: self.state.currentDrop.hasAttribute('minh')
                        ? parseInt(self.state.currentDrop.getAttribute('minh')) : 0,
                    maxH: self.state.currentDrop.hasAttribute('maxh')
                        ? parseInt(self.state.currentDrop.getAttribute('maxh')) : Infinity,
                    type: self.state.currentDrop.getAttribute('data-type'),
                    settings: JSON.parse(self.state.currentDrop.getAttribute('settings')),
                });
                self.props.isItemsRequest(items);
                self.setState({
                    newCounter: self.state.newCounter + 1,
                    currentDrop: null
                });
                clearInterval(hasDrop);
            }
        }, 10);
    };

    _cloneElement = () => {
        const elem = this.props.items.find(i => i.i === this.props.editItem);
        let items = [...this.props.items];

        let newElem = {...elem};
        newElem.i = "n" + this.state.newCounter;
        newElem.settings = {...elem.settings};
        items.push(newElem);

        this.props.isItemsRequest(items);
        this.setState({
            newCounter: this.state.newCounter + 1,
        });
    };

    _onLayoutChange(layout) {
        layout.map(l => {
            const item = this.props.items.find(i => i.i === l.i);
            if (item) {
                const items = [...this.props.items].map(y => {
                    if (y.i === l.i) {
                        y.x = l.x;
                        y.y = l.y;
                        y.h = l.h;
                        y.w = l.w;
                    }
                    return y;
                });
                this.props.isItemsRequest(items);
            }
        });
    }

    _backFromSettings = () => {
        this.props.isEditItemRequest(null);
    };

    _onRemoveItem = (i) => {
        this._backFromSettings();
        this.props.isItemsRequest(_.reject(this.props.items, {i: i}));
    };

    _renderElements = (generalSettings, items) => {
        return _.map(this.props.items, el => this._createElement(el));
    };

    _showPreview = () => {
        if (this.props.isPreview) {
            this.setState({
                template: getPage(true)
            }, this._formatHtmlForPreview);
        } else {
            this.setState({
                template: null
            });
        }
    };

    _formatHtmlForPreview = () => {
        let resizeables = document.getElementsByClassName('react-resizable-handle');
        for (let x = 0; x < resizeables.length; x++) {
            resizeables[x].style.display = 'none';
        }
        let elems = document.querySelectorAll(".react-grid-item");
        [].forEach.call(elems, function (el) {
            el.className = el.className.replace(/\breact-grid-item\b/, "");
        });
    };

    render() {
        const tabList = [
            {
                key: 'content',
                tab: 'Content',
            },
            {
                key: 'settings',
                tab: 'Settings',
            },
        ];
        const tabList2 = [
            {
                key: 'splash',
                tab: 'Splash Data',
            },
        ];

        return (
            <Layout style={{height: '100vh', backgroundColor: '#ffffff'}}>
                {this.state.template ? (
                    <PreviewTemplate template={this.state.template}/>
                ) : (
                    <React.Fragment>
                        <Sider trigger={null}
                               width={300}
                               style={{
                                   backgroundColor: '#f0f2f5',
                               }}>
                            <Card bordered={false}
                                  style={{
                                      width: '100%',
                                      height: '100%',
                                      backgroundColor: 'transparent',
                                      padding: 5,
                                      overflowY: 'auto',
                                      overflowX: 'hidden'
                                  }}
                                  tabList={tabList}
                                  activeTabKey={this.state.key}
                                  onTabChange={key => {
                                      this._onTabChange(key, 'key');
                                  }}>
                                <React.Fragment>
                                    <div className="row p-2 pt-3 d-flex justify-content-start">
                                        {this.state.key === 'content' ? (
                                            <React.Fragment>
                                                <div
                                                    className="m-1 d-flex justify-content-center align-items-center text-center"
                                                    style={{
                                                        width: 90,
                                                        height: 90,
                                                        fontSize: 16,
                                                        color: '#ffffff',
                                                        backgroundColor: 'rgba(0,0,0,0.65)',
                                                        cursor: 'move'
                                                    }}
                                                    draggable={true}
                                                    unselectable="on"
                                                    onDragStart={e => this.setState({currentDrop: e.target})}
                                                    minw={10}
                                                    minh={5}
                                                    data-type="button"
                                                    settings={JSON.stringify({
                                                        label: 'Button',
                                                        multiLine: false,
                                                        style: {
                                                            width: '100%',
                                                            height: '100%',
                                                            color: '#ffffff',
                                                            background: '#e7e7e7',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            textAlign: 'center',
                                                            display: 'inline-block',
                                                            fontSize: '12px',
                                                            margin: '0px',
                                                            fontFamily: Object.keys(FONT_FAMILIES)[0],
                                                            link: '',
                                                        }
                                                    })}
                                                >
                                            <span className="align-middle">
                                                <Icon type="pic-center"/>
                                                <br/>
                                                Button
                                            </span>
                                                </div>
                                                <div
                                                    className="m-1 d-flex justify-content-center align-items-center text-center"
                                                    style={{
                                                        width: 90,
                                                        height: 90,
                                                        fontSize: 16,
                                                        color: '#ffffff',
                                                        backgroundColor: 'rgba(0,0,0,0.65)',
                                                        cursor: 'move'
                                                    }}
                                                    draggable={true}
                                                    unselectable="on"
                                                    onDragStart={e => this.setState({currentDrop: e.target})}
                                                    minw={10}
                                                    minh={10}
                                                    data-type="text"
                                                    settings={JSON.stringify({
                                                        label: 'Enter Some Text',
                                                        multiLine: true,
                                                        style: {
                                                            width: '100%',
                                                            height: '100%',
                                                            color: 'black',
                                                            background: '#ffffff',
                                                            border: 'none',
                                                            display: 'inline-block',
                                                            overflow: 'hidden',
                                                            fontSize: '13px',
                                                            fontFamily: Object.keys(FONT_FAMILIES)[0],
                                                            textAlign: 'left',
                                                        }
                                                    })}
                                                >
                                            <span className="align-middle">
                                                <Icon type="font-size"/>
                                                <br/>
                                                Text
                                            </span>
                                                </div>
                                                <div
                                                    className="m-1 d-flex justify-content-center align-items-center text-center"
                                                    style={{
                                                        width: 90,
                                                        height: 90,
                                                        fontSize: 16,
                                                        color: '#ffffff',
                                                        backgroundColor: 'rgba(0,0,0,0.65)',
                                                        cursor: 'move'
                                                    }}
                                                    draggable={true}
                                                    unselectable="on"
                                                    onDragStart={e => this.setState({currentDrop: e.target})}
                                                    minw={10}
                                                    minh={8}
                                                    data-type="image"
                                                    settings={JSON.stringify({
                                                        label: 'Source not found',
                                                        imageUrl: '',
                                                        style: {
                                                            position: 'absolute',
                                                            width: '100%',
                                                            height: '100%',
                                                            link: '',
                                                            imageSize: '',
                                                        }
                                                    })}
                                                >
                                            <span className="align-middle">
                                                <Icon type="picture"/>
                                                <br/>
                                                Image
                                            </span>
                                                </div>
                                                <div
                                                    className="m-1 d-flex justify-content-center align-items-center text-center"
                                                    style={{
                                                        width: 90,
                                                        height: 90,
                                                        fontSize: 16,
                                                        color: '#ffffff',
                                                        backgroundColor: 'rgba(0,0,0,0.65)',
                                                        cursor: 'move'
                                                    }}
                                                    draggable={true}
                                                    unselectable="on"
                                                    onDragStart={e => this.setState({currentDrop: e.target})}
                                                    data-type="divider"
                                                    minw={10}
                                                    minh={1}
                                                    maxH={2}
                                                    settings={JSON.stringify({
                                                        label: 'Divider',
                                                        multiLine: false,
                                                        style: {
                                                            width: '100%',
                                                            height: '100%',
                                                            background: '#e7e7e7',
                                                            border: 'none',
                                                        }
                                                    })}
                                                >
                                            <span className="align-middle">
                                                <Icon type="pic-center"/>
                                                <br/>
                                                Divider
                                            </span>
                                                </div>
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <GeneralSettings/>
                                                <div className="col-12 mt-2 mb-2 text-right">
                                                    <Button type="primary" icon="export"
                                                            onClick={this._exportPage}>
                                                        Export
                                                    </Button>
                                                </div>
                                            </React.Fragment>
                                        )}
                                        <Card bordered={false}
                                              style={{
                                                  width: '100%',
                                                  marginTop: 120,
                                                  backgroundColor: 'transparent',
                                                  padding: 5
                                              }}
                                              tabList={tabList2}
                                              activeTabKey='splash'>
                                            <p className="text-center font-weight-bold p-3">Coming Soon</p>
                                        </Card>
                                    </div>
                                </React.Fragment>
                            </Card>
                        </Sider>
                        <Layout style={{backgroundColor: '#ffffff'}}>
                            <Content
                                id="page"
                                style={{
                                    margin: 'auto',
                                    marginTop: '16px',
                                    marginBottom: '16px',
                                    background: 'transparent',
                                    width: 600,
                                    position: 'relative',
                                    transition: 'height 200ms ease',
                                }}
                            >
                                <ReactGridLayout
                                    {...this.props}
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderLeft: '1px dashed rgba(0,0,0,0.2)',
                                        borderRight: '1px dashed rgba(0,0,0,0.2)',
                                        overflow: 'auto',
                                        overflowX: 'hidden'
                                    }}
                                    width={600}
                                    autoSize={false}
                                    layouts={this.state.layouts}
                                    measureBeforeMount={false}
                                    isDroppable={true}
                                    onDrop={this._onDrop}
                                    onLayoutChange={(layout) =>
                                        this._onLayoutChange(layout)
                                    }
                                >
                                    {this._renderElements(this.props.generalSettings, this.props.items)}
                                </ReactGridLayout>
                            </Content>
                        </Layout>
                        <Sider trigger={null}
                               collapsible
                               collapsedWidth={0}
                               collapsed={!this.props.editItem}
                               width={350}
                               style={{
                                   backgroundColor: '#f0f2f5',
                                   overflowY: 'auto',
                               }}>
                            <Card title="Settings" bordered={false}
                                  extra={[
                                      <Tooltip title="Clone">
                                          <a className='p-1 mr-2'
                                             style={{color: '#1f1f1f'}}
                                             onClick={this._cloneElement}>
                                              <Icon type='plus'/>
                                          </a>
                                      </Tooltip>,
                                      <Tooltip title="Remove">
                                          <a className='p-1 mr-2'
                                             style={{color: '#ff0000'}}
                                             onClick={() => this._onRemoveItem(this.props.editItem)}>
                                              <Icon type='delete'/>
                                          </a>
                                      </Tooltip>,
                                      <Tooltip title="Close">
                                          <a style={{color: '#1f1f1f'}}
                                             className='p-1'
                                             onClick={this._backFromSettings}><Icon type='close'/></a>
                                      </Tooltip>
                                  ]}
                                  style={{
                                      width: '100%',
                                      height: '100%',
                                      backgroundColor: 'transparent',
                                      padding: 5
                                  }}>
                                {this.props.editItem ? <ElementSetting/> : null}
                            </Card>
                        </Sider>
                    </React.Fragment>
                )}
                <Actions/>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        items: itemsData(state),
        editItem: editItem(state),
        generalSettings: generalSettings(state),
        isPreview: isPreview(state)
    }
}

const mapDispatchToProps = {
    isItemsRequest: isItemsRequest,
    isEditItemRequest: isEditItemRequest,
    generalSettingsRequest: generalSettingsRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(App);