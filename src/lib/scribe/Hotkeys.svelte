<style>
    .dialog {
        max-width: 80% !important;
    }

    .container {
        margin: 1em;
    }

    .hotkeys {
        align-self: center;
        /* text-align: center; */
    }
</style>

<!-- BEGIN #modalHotkeys -->
<div class="modal fade" id="modalHotkeys">
    <div class="modal-dialog dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Hot Keys</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="alert alert-muted">
                    <b>General Use:</b> commonly used shortcuts. 
                </div>
                <div class="mb-3">
                    <div class="row container">
                        <div class="col-3 hotkeys">
                            <button type="button" class="btn btn-outline-default">~ (esc)</button>
                        </div>
                        <div class="col-9">
                            Escape image selection/cropping.
                        </div>
                    </div>
                    <div class="row container">
                        <div class="col-3 hotkeys">
                            <button type="button" class="btn btn-outline-default">Spacebar</button>
                        </div>
                        <div class="col-9">
                            Play or pause the video.
                        </div>
                    </div>
                    <div class="row container">
                        <div class="col-3 hotkeys">
                            <button type="button" class="btn btn-outline-default">Tab</button>
                        </div>
                        <div class="col-9">
                            Tabs to the next word in the timeline.
                        </div>
                    </div>
                    <div class="row container">
                        <div class="col-3 hotkeys">
                            <button type="button" class="btn btn-outline-default">Shift</button> +
                            <button type="button" class="btn btn-outline-default">Tab</button>
                        </div>
                        <div class="col-9">
                            Tabs to the previous word in the timeline.
                        </div>
                    </div>
                    <div class="row container">
                        <div class="col-3 hotkeys">
                            <button type="button" class="btn btn-outline-default">⌘ (cmd)</button> +
                            <button type="button" class="btn btn-outline-default">Spacebar</button>
                        </div>
                        <div class="col-9">
                            If editing a word, this will return focus to the player and begin playback.
                        </div>
                    </div>
                    <div class="row container">
                        <div class="col-3 hotkeys">
                            <button type="button" class="btn btn-outline-default">⌘ (cmd)</button> +
                            <button type="button" class="btn btn-outline-default">Z</button>
                        </div>
                        <div class="col-9">
                            Undo changes to segments or the timeline.
                        </div>
                    </div>
                </div>
                <div class="alert alert-muted">
                    <b>Segment Timeline Adjustments:</b> shortcuts to shift or adjust a segment in the timeline. 
                </div>
                <div class="mb-3">
                    <div class="row container">
                        <div class="col-3 hotkeys">
                            <button type="button" class="btn btn-outline-default">⌘ (cmd)</button> + Drag
                        </div>
                        <div class="col-9">
                            Free drag. Ignores other segment border limitations. Dragging from the center of the segment will shift the entire segment. Dragging from the edges will evenly adjust all timestamps versus just adjusting the start or end time.
                        </div>
                    </div>
                    <div class="row container">
                        <div class="col-3 hotkeys">
                            <button type="button" class="btn btn-outline-default">⌘ (cmd)</button> +
                            <button type="button" class="btn btn-outline-default">◀ or ▶</button>
                        </div>
                        <div class="col-9">
                            This will instantly shift the entire segment to the currently selected point in time if that point in time does not exceed the first or last word's timestamps.
                        </div>
                    </div>
                    <div class="row container">
                        <div class="col-3 hotkeys">
                            <button type="button" class="btn btn-outline-default">(alt) Option</button> +
                            <button type="button" class="btn btn-outline-default">◀ or ▶</button>
                        </div>
                        <div class="col-9">
                            This will instantly adjust the start or end time of the segment to the currently selected point in time if that point in time does not exceed the first or last word's timestamps.
                        </div>
                    </div>
                </div>
                <div class="alert alert-muted">
                    <b>Word Timestamp Adjustments:</b> shortcuts to shift or adjust a word's timestamps. 
                </div>
                <div class="mb-3">
                    <div class="row container">
                        <div class="col-3 hotkeys">
                            <button type="button" class="btn btn-outline-default">⌘ or (alt)</button> +
                            <button type="button" class="btn btn-outline-default">Spacebar</button>
                        </div>
                        <div class="col-9">
                            Preview word.
                        </div>
                    </div>
                    <div class="row container">
                        <div class="col-3 hotkeys">
                            <button type="button" class="btn btn-outline-default">⌘ (cmd)</button> +
                            <button type="button" class="btn btn-outline-default">◀ or ▶</button>
                        </div>
                        <div class="col-9">
                            If the cursor is not already positioned at the start or end of the word, pressing either arrow key will place the cursor at the start or end. Once positioned, the arrow keys will shift the entire word.
                        </div>
                    </div>
                    <div class="row container">
                        <div class="col-3 hotkeys">
                            <button type="button" class="btn btn-outline-default">(alt) Option</button> +
                            <button type="button" class="btn btn-outline-default">◀ or ▶</button>
                        </div>
                        <div class="col-9">
                            If the cursor is not already positioned at the start or end of the word, pressing the arrow keys will place the cursor at the start or end. Once positioned, the arrow keys will adjust the word's start or end time.
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-theme" data-bs-dismiss="modal">Got It!</button>
            </div>
        </div>
    </div>
</div>
<!-- END #modalHotkeys -->