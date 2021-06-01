export interface GlobalDataProps {
  components: Component[];
  currentElement: string;
}
interface Component {
  id: string;
  name: string;
  props: {
    [key: string]: any;
  };
}
