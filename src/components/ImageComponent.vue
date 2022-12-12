<template>
    <div class="imageContainer" v-if="!loading && url.length">
        <img :src="url" ref="imgElem" />
    </div>
    <div v-if="!url.length" class="content">
        No media found
    </div>
</template>

<script>

export default {
    props: [
        "setIsOpen",
        "isBlackTheme",
        "url",
        "loading",
        "top",
        "right",
        "width",
        "height",
        "imgWidth",
        "imgHeight"
    ],
    name: "image-component",
}
</script>

<style>

.imageContainer {
    overflow: hidden
}

.imageContainer img {
    width: 100vw;
    height: 100vh;
}

.content {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
}
</style>
