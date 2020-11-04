FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
)

FilePond.setOptions({
    stylePanelAspectRatio: 100 / 150, //hight and width
    imageResizeTargetWidth: 150,
    imageResizeTargetHeight: 100
})

FilePond.parse(document.body);