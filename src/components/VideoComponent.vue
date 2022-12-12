<template>
    <div
        id="player"
        :ref="handleId"
    >
        <div class="video-box">
            <video
                id="video-element"
                ref="videoElem"
                class="videoContainer"
                @ended="endedVideo()"
                @timeupdate="updateProgressBar()"
            >
                <source
                    :src="url"
                    :type="type"
                >
            </video>
        </div>
        <div id="controls">
            <div class="counters">
                <div class="currentTime">
                    {{ formatTime(currentTime()) }}
                </div>
                <div class="totalTime">
                    {{ formatTime(duration()) }}
                </div>
            </div>
            <div
                class="wrapperProgressbar"
                @click="skipVideo($event)"
            >
                <progress
                    id="progress-bar"
                    ref="progressBar"
                    class="progressBar"
                    max="100"
                    min="0"
                    value="0"
                >
                    0% played
                </progress>
            </div>
            <div class="row">
                <div class="wrap">
                    <button
                        id="btnReplay"
                        :class="{ active: isActive }"
                        class="icon-dl-repeat btnReplay"
                        @click="replayVideo()"
                    />
                    <span @click="changeSpeed()">x{{ speedValue }}</span>
                </div>
                <div class="buttons">
                    <button
                        id="btnStart"
                        class="icon-dl-back"
                        @click="resetPlayer()"
                    />
                    <button
                        id="btnPrevious"
                        class="icon-dl-back-1"
                        @click="toPreviousFrame()"
                    />
                    <button
                        v-if="isPlayBtn"
                        id="btnPlay"
                        class="icon-dl-play"
                        @click="playPauseVideo()"
                    />
                    <button
                        v-else
                        id="btnPause"
                        class="icon-dl-pause"
                        @click="playPauseVideo()"
                    />
                    <button
                        id="btnNext"
                        class="icon-dl-forward"
                        @click="toNextFrame()"
                    />
                    <button
                        id="btnEnd"
                        class="icon-dl-next"
                        @click="toEndVideo()"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "VideoComponent",
    props: [
        "setIsOpen",
        "isBlackTheme",
        "url",
        "top",
        "right",
        "type",
        "typeOfContent",
        "width",
        "height",
        "videoWidth",
        "videoHeight"],

    data: function () {
        return {
            isActive: false,
            isPlayBtn: true,
            speedValue: 1,
            handleId: "handle-id",
        }
    },
    computed: {
        player() {
            return this.$refs.videoElem;
        },
        progressBar() {
            return this.$refs.progressBar;
        },
    },
    mounted() {
        let events = [
            'timeupdate',
            'volumechange',
            'seeked',
            'loadedmetadata'
        ];

        events.map(e => {
            this.$refs.videoElem.addEventListener(e, () => {
                this.$forceUpdate();
            });
        });

        this.$refs.videoElem.addEventListener('loadedmetadata', () => {
            this.$refs.videoElem.volume = 0;
            this.$forceUpdate();
        });
    },
    methods: {
        playPauseVideo() {
            if (this.player.paused || this.player.ended) {
                this.isPlayBtn = false
                this.player.play();
            } else {
                this.player.pause();
                this.isPlayBtn = true
            }
        },
        endedVideo() {
            this.isPlayBtn = true;
        },
        progressPercentage: function () {
            return (this.currentTime() / this.duration()) * 100;
        },
        skipVideo(event) {
            let wrapperOffset = event.currentTarget.getBoundingClientRect().left;
            let clickedOffset = event.clientX - wrapperOffset;
            let progress_width = (clickedOffset / event.currentTarget.getBoundingClientRect().width) * 100;
            let newTime = (this.duration() / 100) * progress_width;
            this.$refs.videoElem.currentTime = newTime;
        },
        updateProgressBar() {
            let percentage = Math.floor((100 / this.player.duration) * this.player.currentTime);
            this.progressBar.value = percentage;
            this.progressBar.innerHTML = percentage + '% played';
        },
        resetPlayer() {
            this.player.currentTime = 0;
        },
        toEndVideo() {
            this.player.currentTime = this.player.duration;
        },
        toPreviousFrame() {
            this.player.currentTime = this.player.currentTime - 1;
        },
        toNextFrame() {
            this.player.currentTime = this.player.currentTime + 1;
        },
        replayVideo() {
            this.isActive = !this.isActive;
            this.isActive ? this.player.loop = true : this.player.loop = false;
        },
        currentTime() {
            return this.$refs.videoElem?.currentTime || 0;
        },
        duration() {
            return this.$refs.videoElem?.duration || 0;
        },
        formatTime(time) {
            if (!time || !parseInt(time)) {
                return `00:00`;
            }
            let hours, minutes, seconds;
            minutes = Math.floor(((time / 60) % 60)),
                seconds = Math.floor(time % 60),
                hours = Math.floor(time / 60 / 60);

            if (minutes < 10) minutes = `0${minutes}`;
            if (seconds < 10) seconds = `0${seconds}`;

            return `${hours ? hours + ':' : ''}${minutes}:${seconds}`;
        },
        speedUp(value) {
            if (value === 0.5) {
                this.player.playbackRate = 0.5;
            }
            if (value === 1) {
                this.player.playbackRate = 1;
            }
            if (value === 2) {
                this.player.playbackRate = 2.0;
            }
            if (value === 4) {
                this.player.playbackRate = 4.0;
            }
            if (value > 4) {
                this.player.playbackRate = 0.5;
            }
        },
        changeSpeed() {
            if (this.speedValue < 4) {
                this.speedValue = this.speedValue * 2;
                this.speedUp(this.speedValue);
            } else {
                this.speedValue = 0.5;
                this.speedUp(this.speedValue);
            }
        },
    }
}
</script>

<style>
#player {
    background-color: var(--dl-color-studio-panel);
    pointer-events: all;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.videoContainer {
    border-radius: 2px;
    width: 90%;
}

button {
    background: none;
    border: 0px;
    cursor: pointer;
}

#player button:before {
    color: var(--dl-color-icon-default);
}

#controls {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 30px;
}

.counters {
    width: 90%;
    display: flex;
    justify-content: space-between;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    color: var(--dl-color-icon-default);
    margin-top: 5px;
}

.buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.buttons button:before {
    font-size: 18px;
}

.btnReplay:before {
    color: var(--dl-color-panel-header);
}

.row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 12px;
    width: 90%;
}
/*.row {*/
/*    display: flex;*/
/*    flex-direction: row;*/
/*    margin-top: 12px;*/
/*    width: 90%;*/
/*}*/

.wrap {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: center;
    position: absolute;
    left: 4%;
}

.wrap span {
    cursor: pointer;
    color: var(--dl-color-panel-header);
}

.wrap button:before {
    cursor: pointer;
    color: var(--dl-color-panel-header);
}

.closeBtn {
    width: 20px;
    height: 20px;
    text-align: center;
    position: absolute;
    right: 1%;
    margin: 5px;
}

.closeBtn:before {
    font-size: 12px;
}

.wrapperProgressbar {
    padding: 8px;
    width: 90%;
    cursor: pointer;
    height: 1px;
    display: flex;
}

.progressBar {
    height: 2px;
    width: 100%;
    border-radius: 0px;
    background: rgba(255, 255, 255, 0.25);
    margin: 0;
}

.containerBlack progress[value]::-webkit-progress-value {
    background-color: #7C8CFF;
}

.containerWhite progress[value]::-webkit-progress-value {
    background-color: #3452FF;
}

.containerBlack .active::before {
    color: #7C8CFF;
}

.containerWhite .active:before {
    color: #3452FF;
}

.video-box {
    margin-top: 30px;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.vdr {
    border: none;
}
</style>
