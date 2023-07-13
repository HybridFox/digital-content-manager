import { Outlet } from "react-router-dom"

import { Menu } from "../menu/menu.component"

export const Root = () => {
	return <div>
		<p>This is the root or something idk</p>
		<Menu />
		<Outlet />
	</div>
}
