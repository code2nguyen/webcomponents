import { DashboardLayout } from './src/components/dashboard-layout/dashboard-layout.component';
import { DashboardItem } from './src/components/dashboard-item/dashboard-item.component';
import { QuillEditor } from './src/components/quill-editor/quill-editor.component';
import { QuillEditorToolbar } from './src/components/quill-editor-toolbar/quill-editor-toolbar.component';
import { CalendarClock } from './src/components/calendar-clock/calendar-clock.component';

window.customElements.define('cff-dashboard-layout', DashboardLayout);
window.customElements.define('cff-dashboard-item', DashboardItem);
window.customElements.define('cff-quill-editor', QuillEditor);
window.customElements.define('cff-quill-editor-toolbar', QuillEditorToolbar);
window.customElements.define('cff-calendar-clock', CalendarClock);
