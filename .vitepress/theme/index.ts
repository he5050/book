import 'uno.css';
import Teek from 'vitepress-theme-teek';
import { onMounted } from "vue";
import 'vitepress-theme-teek/index.css';
import '../styles/public.scss';
import { setupImageErrorPatch } from "../tools/image-error-handler";
export default {
	extends: Teek,
	setup() {
		onMounted(() => {
		  setupImageErrorPatch();
		});
	  }
};
