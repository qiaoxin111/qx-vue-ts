import { createStore } from "vuex";
import user, { UserProp } from './users' 
import templates, {TemplatesProps} from './templetes'
import editor, { EditorProps } from './editor'

export interface GlobalDataProps {
  templates: TemplatesProps[];
  user: UserProp;
  editor: EditorProps
}


const store = createStore<GlobalDataProps>({
  modules:{
    user,
    templates,
    editor
  }
});

export default store;
