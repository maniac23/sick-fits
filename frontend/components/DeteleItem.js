import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

export default class DeteleItem extends Component {
  update = (cache, payload) => {
    // manually update the client
    // 1. Read th cache
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    console.log(data);
    // 2. Filter deleted item out of the page
    const filteredItems = data.items.filter(
      item => item.id !== payload.data.deleteItem.id
    );
    // 3. Put the items back
    cache.writeQuery({
      query: ALL_ITEMS_QUERY,
      data: {
        items: filteredItems
      }
    });
  };
  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}>
        {(deleteItem, { error }) => (
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this item?')) {
                deleteItem().catch(err => {
                  alert(err.message);
                });
              }
            }}>
            Delete ❌
          </button>
        )}
      </Mutation>
    );
  }
}
