import styled from 'styled-components'

const Button = styled.button`
	color: ${({ theme }) => theme.text};
	background: transparent;
	border: 1px solid ${({ theme }) => theme.accent};
	border-radius: 0.25em;
	padding: 0.5em;
	cursor: pointer;
	font-size: 1.2em;

	&.transparent {
		padding: 0.2em;
	}

	&.large {
		font-size: 1.5em;
	}

	&.small {
		font-size: 0.75em;
	}

	&:disabled {
		color: ${({ theme }) => theme.error};
		border-color: ${({ theme }) => theme.error};
	}
`;

export default Button
