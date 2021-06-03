import { GlobalDataProps } from './index'
import { Module } from 'vuex'
import { v4 as uuidv4 } from 'uuid';

export interface ComponentData {
  id: string;
  name: string;
  props: {
    [key: string]: string
  }
}

export interface EditorProps{
  components: ComponentData[],
  currentElement: string
}

const testComponents: ComponentData[] = [
  {id: uuidv4(), name: 'l-text', props: {test: 'hello'}},
  {id: uuidv4(), name: 'l-text', props: {test: 'hello'}},
  {id: uuidv4(), name: 'l-text', props: {test: 'hello'}},
  {id: uuidv4(), name: 'l-text', props: {test: 'hello'}}
]

const editor: Module<EditorProps, GlobalDataProps> = {
  state:{
    components: testComponents,
    currentElement: ''
  } 
}

export default editor