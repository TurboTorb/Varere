<!-- BEGIN modal -->
<div class="modal fade" id="modalAddTask">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add Task</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label">Title</label>
                    <input type="text" class="form-control" placeholder="e.g Feature enhancement" />
                </div>
                <div class="mb-3">
                    <label class="form-label">Status</label>
                    <select class="form-select">
                        <option value="">To Do</option>
                        <option value="">In Progress</option>
                        <option value="">Done</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Tags</label>
                    <ul id="jquery-tagit" class="tagit form-control">
                        <li>enhancement</li>
                    </ul>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="form-control" rows="10"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <a href="#" class="btn btn-outline-default" data-bs-dismiss="modal">Cancel</a>
                <button type="button" class="btn btn-outline-theme">Create</button>
            </div>
        </div>
    </div>
</div>
<!-- END modal -->