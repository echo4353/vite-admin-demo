import KrEditor from './KrEditor.vue'

KrEditor.install = (app) => {
  app.component('KrEditor', KrEditor)
}

export default KrEditor
