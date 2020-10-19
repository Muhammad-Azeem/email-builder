export const itemsData = (state) => {
    return state.items.data != null ? state.items.data : null;
};
export const editItem = (state) => {
    return state.items.edit != null ? state.items.edit : null;
};
export const generalSettings = (state) => {
    return state.items.generalSettings != null ? state.items.generalSettings : null;
};
export const isPreview = (state) => {
    return state.items.preview != null ? state.items.preview : null;
};