/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
// import categories from './api/categories';

const products = productsFromServer.map(product => {
  const category =
    categoriesFromServer.find(
      currentCategory => currentCategory.id === product.categoryId,
    ) || null;

  const user =
    category !== null
      ? usersFromServer.find(
        // eslint-disable-next-line prettier/prettier
        currentUser => currentUser.id === category.ownerId,
      ) || null
      : null;

  return {
    ...product,
    category,
    user,
  };
});

function getVisibleProducts(allProducts, { query, selectedUserId }) {
  let visibleProducts = [...allProducts];

  if (selectedUserId !== 0) {
    visibleProducts = visibleProducts.filter(product => {
      return product.user?.id === selectedUserId;
    });
  }

  if (query !== '') {
    visibleProducts = visibleProducts.filter(product => {
      return product.name.toLowerCase().includes(query.toLowerCase());
    });
  }

  return visibleProducts;
}

export const App = () => {
  const [query, setQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(0);

  const visibleProducts = getVisibleProducts(products, {
    query,
    selectedUserId,
  });

  const resetAllFilters = () => {
    setQuery('');
    setSelectedUserId(0);
  };

  const shouldShowClearButton = query !== '';
  const shouldShowResetButtonAsActive = query !== '' || selectedUserId !== 0;
  const hasVisibleProducts = visibleProducts.length > 0;

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={selectedUserId === 0 ? 'is-active' : ''}
                onClick={event => {
                  event.preventDefault();
                  setSelectedUserId(0);
                }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={selectedUserId === user.id ? 'is-active' : ''}
                  onClick={event => {
                    event.preventDefault();
                    setSelectedUserId(user.id);
                  }}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {shouldShowClearButton && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAllFilters}
                disabled={!shouldShowResetButtonAsActive}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!hasVisibleProducts && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {hasVisibleProducts && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>User</th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>

                    <td data-cy="ProductCategory">
                      {product.category.icon} - {product.category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={
                        product.user.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
