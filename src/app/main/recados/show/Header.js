import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import PageCardedHeader from 'app/fuse-layouts/shared-components/page-carded-header/PageCardedHeader';

function Header() {
	const recadoRedux = useSelector(({ recado }) => recado);
	const [recado, setRecado] = useState({});

	useEffect(() => {
		if (recadoRedux) {
			setRecado(recadoRedux);
		}
	}, [recadoRedux]);

	return <PageCardedHeader link="/recado" title={recado?.titulo || 'Novo recado'} textBack="Recados" />;
}

export default Header;
