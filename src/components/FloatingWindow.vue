<template>
    <div>
        <VideoComponent
            v-if="typeOfContent === 'video' && videoHeight && videoWidth || typeOfContent === 'video' && width && height"
            :set-is-open="setIsOpen"
            :is-black-theme="isBlackTheme"
            :url="url"
            :top="top"
            :right="right"
            :type="type"
            :width="width"
            :height="height"
            :video-width="videoWidth"
            :video-height="videoHeight"
        />
        <ImageComponent
            v-if="typeOfContent === 'image'"
            :set-is-open="setIsOpen"
            :loading="loading"
            :url="url"
            :top="top"
            :right="right"
            :width="width"
            :height="height"
            :img-width="imgWidth"
            :img-height="imgHeight"
        />
    </div>
</template>

<script>
import VideoComponent from './VideoComponent.vue';
import ImageComponent from './ImageComponent.vue';

export default {
    name: "FloatingWindow",
    components: {
        VideoComponent,
        ImageComponent
    },
    props: [
        "setIsOpen",
        "loading",
        "isBlackTheme",
        "url",
        "top",
        "right",
        "type",
        "typeOfContent",
        "width",
        "height"
    ],

    data: function() {
        return {
            imgWidth: null,
            imgHeight: null,
            videoWidth: null,
            videoHeight: null,
        }
    },
    mounted() {
        if (this.typeOfContent === 'video' && !this.width  && !this.height) {
            const video = document.createElement('video');
            video.src = this.url;
            video.addEventListener('loadedmetadata', () => {
                this.videoWidth = video.videoWidth;
                this.videoHeight = video.videoHeight + 100;
            });

        } else if (this.typeOfContent === 'image' && !this.width  && !this.height) {
            const img = new Image();
            img.src = this.url;
            img.addEventListener('load', () => {
                this.imgWidth = img.naturalWidth;
                this.imgHeight = img.naturalHeight;
            });
        }
    },
}
</script>
