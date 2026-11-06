/**
 * Audio Visualizer System (V40.0 - Restored Ring + Seconds Arc)
 * - Ring visualizer drawn AROUND the clock at all times
 * - Static minimal ring when no audio plays (no GPU waste)
 * - Full animated ring when audio plays
 * - stopDrawing() suspends animation, keeps static ring visible
 */
const AudioVisualizer = {
    audioCtx: null,
    analyser: null,
    canvas: null,
    canvasCtx: null,
    dataArray: null,
    bufferLength: 32,
    sources: new Map(),
    pendingSources: [],
    isActive: false,
    _drawLoop: null,

    init: function () {
        this.canvas = document.getElementById('visualizer-canvas');
        if (!this.canvas) return;
        this.canvasCtx = this.canvas.getContext('2d', { alpha: true });
        this.resizeCanvas();
        // Draw static ring immediately on init
        this.drawStatic();
        console.log("AudioVisualizer V40.0 Initialized.");
    },

    resizeCanvas: function () {
        if (!this.canvas) return;
        this.canvas.width = 260;
        this.canvas.height = 260;
    },

    unlockAudio: function () {
        if (this.audioCtx) return;
        try {
            var AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioCtx();
            this.analyser = this.audioCtx.createAnalyser();
            this.analyser.fftSize = 64;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            console.log("AudioVisualizer: Audio Context Unlocked");
            // Connect any pending sources
            var self = this;
            this.pendingSources.forEach(function(s) { self.connectSource(s); });
            this.pendingSources = [];
        } catch (e) {
            console.error("Web Audio API not supported", e);
        }
    },

    connectSource: function (mediaElement) {
        if (!mediaElement) return null;
        if (!this.audioCtx) {
            if (!this.pendingSources.includes(mediaElement)) {
                this.pendingSources.push(mediaElement);
            }
            return null;
        }
        if (mediaElement._isConnectedToVisualizer) return null;
        try {
            mediaElement.crossOrigin = "anonymous";
            var source = this.audioCtx.createMediaElementSource(mediaElement);
            source.connect(this.audioCtx.destination);
            source.connect(this.analyser);
            mediaElement._isConnectedToVisualizer = true;
            var self = this;
            mediaElement.addEventListener('play', function() { self.startDrawing(); });
            mediaElement.addEventListener('pause', function() { self.stopDrawing(); });
            mediaElement.addEventListener('ended', function() { self.stopDrawing(); });
            console.log("AudioVisualizer: Source connected.");
            return source;
        } catch (e) {
            console.error("AudioVisualizer: Error connecting source:", e);
            return null;
        }
    },

    startDrawing: function () {
        if (this.isActive) return;
        this.isActive = true;
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        this._drawAnimated();
    },

    stopDrawing: function () {
        this.isActive = false;
        if (this._drawLoop) {
            cancelAnimationFrame(this._drawLoop);
            this._drawLoop = null;
        }
        // Keep static ring visible after audio stops
        this.drawStatic();
    },

    /**
     * Draw a minimal static ring — DISABLED: canvas stays transparent.
     */
    drawStatic: function () {
        if (!this.canvas || !this.canvasCtx) return;
        // Ring removed per user request — clear canvas only
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    /**
     * Animated ring — DISABLED: canvas stays transparent during audio too.
     */
    _drawAnimated: function () {
        if (!this.isActive) return;
        var self = this;
        this._drawLoop = requestAnimationFrame(function() { self._drawAnimated(); });

        var ctx = this.canvasCtx;
        if (!ctx) return;
        // Ring removed per user request — only clear canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    AudioVisualizer.init();
});
