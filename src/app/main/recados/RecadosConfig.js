import { authRoles } from 'app/auth';
import React from 'react';

const RecadosConfig = {
	settings: {
		layout: {
			config: {
				mode: 'fullwidth',
				scroll: 'content',
				navbar: {
					display: true,
					folded: false,
					position: 'left'
				},
				toolbar: {
					display: true,
					style: 'fixed',
					position: 'below'
				},
				footer: {
					display: false,
					style: 'fixed',
					position: 'below'
				}
			}
		}
	},
	// auth: authRoles.admin,
	routes: [
		{
			path: '/recado/:id',
			component: React.lazy(() => import('./show/Recado'))
		},
		{
			path: '/recado',
			exact: true,
			component: React.lazy(() => import('./list/Recado'))
		}
	]
};

export default RecadosConfig;
