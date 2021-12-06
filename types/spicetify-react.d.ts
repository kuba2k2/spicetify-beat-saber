/// <reference types="react" />
/// <reference types="react-dom" />

import ReactUMD = React
import ReactDomUMD = ReactDOM

declare namespace Spicetify {
	namespace React {
		class Component<P = {}, S = {}, SS = any> extends ReactUMD.Component<P, S, SS> {}
		class PureComponent<P = {}, S = {}, SS = any> extends ReactUMD.PureComponent<P, S, SS> {}
		type ReactElement = ReactUMD.ReactElement
		type ReactChild = ReactUMD.ReactChild
		type ReactNode = ReactUMD.ReactNode
		type Ref<T> = ReactUMD.Ref<T>
		type RefObject<T> = ReactUMD.RefObject<T>

		interface ClipboardEvent<T = Element> extends ReactUMD.ClipboardEvent<T> {}
		interface CompositionEvent<T = Element> extends ReactUMD.CompositionEvent<T> {}
		interface DragEvent<T = Element> extends ReactUMD.DragEvent<T> {}
		interface FocusEvent<T = Element> extends ReactUMD.FocusEvent<T> {}
		interface FormEvent<T = Element> extends ReactUMD.FormEvent<T> {}
		interface ChangeEvent<T = Element> extends ReactUMD.ChangeEvent<T> {}
		interface KeyboardEvent<T = Element> extends ReactUMD.KeyboardEvent<T> {}
		interface MouseEvent<T = Element> extends ReactUMD.MouseEvent<T> {}
		interface TouchEvent<T = Element> extends ReactUMD.TouchEvent<T> {}
		interface PointerEvent<T = Element> extends ReactUMD.PointerEvent<T> {}
		interface UIEvent<T = Element> extends ReactUMD.UIEvent<T> {}
		interface WheelEvent<T = Element> extends ReactUMD.WheelEvent<T> {}
		interface AnimationEvent<T = Element> extends ReactUMD.AnimationEvent<T> {}
		interface TransitionEvent<T = Element> extends ReactUMD.TransitionEvent<T> {}

		function createRef<T>(): ReactUMD.RefObject<T>

		function createElement<
			P extends {},
			T extends ReactUMD.Component<P, ReactUMD.ComponentState>,
			C extends ReactUMD.ComponentClass<P>
		>(
			type: ReactUMD.ClassType<P, T, C>,
			props?: (ReactUMD.ClassAttributes<T> & P) | null,
			...children: ReactUMD.ReactNode[]
		): ReactUMD.CElement<P, T>
	}

	namespace ReactDOM {
		function findDOMNode(
			instance: ReactUMD.ReactInstance | null | undefined
		): Element | null | Text

		function unmountComponentAtNode(
			container: Element | DocumentFragment
		): boolean

		function createPortal(
			children: ReactUMD.ReactNode,
			container: Element,
			key?: null | string
		): ReactUMD.ReactPortal

		const version: string
		const render: ReactDomUMD.Renderer
		const hydrate: ReactDomUMD.Renderer
	}
}
