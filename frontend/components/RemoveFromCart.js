import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { CURRENT_USER_QUERY } from './User';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: none;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

export default class RemoveFromCart extends React.Component {
  update = (cache, payload) => {
    // read the apollo cache
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });
    console.log(data);
    // remove item from cart
    const cartItemId = payload.data.removeFromCart.id;
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);
    // write it back to cache
    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  };
  render() {
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
        optimisticResponse={{
          __typename: 'Mutation',
          removeFromCart: {
            __typename: 'CartItem',
            id: this.props.id
          }
        }}>
        {(removeFromCart, { loading }) => (
          <BigButton
            title="Delete item"
            onClick={() => {
              removeFromCart().catch(err => alert(err.message));
            }}
            disabled={loading}>
            &times;
          </BigButton>
        )}
      </Mutation>
    );
  }
}
