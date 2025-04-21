import { inject } from '@angular/core';
import { ApolloClientOptions, ApolloLink, FetchResult, InMemoryCache, NormalizedCacheObject } from '@apollo/client/core';
import { HttpLink, HttpLinkHandler } from 'apollo-angular/http';

export function apolloClientOptionsFactory(): ApolloClientOptions<NormalizedCacheObject> {
  const _httpLink: HttpLink = inject(HttpLink);
  const _linkHandler: HttpLinkHandler = _httpLink.create({ uri: 'https://graphql.anilist.co' });
  const _responseInterceptor: ApolloLink = new ApolloLink((_operation, _forward) => {
    return _forward(_operation).map((_response: FetchResult) => _response);
  });
  const _link: ApolloLink = _responseInterceptor.concat(_linkHandler);

  return {
    link: _link,
    cache: new InMemoryCache(),
  };
}