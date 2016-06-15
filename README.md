# Focus Redux

## Why ?

- In focus components we provide a form which even if it was separated in sevral mixin, was really to use as a stand alone component.
- We also found that there was state related issue inside many components, some from focus, some from the one built inside the projects.
- We also want users to be able to have a better understanding of whats is going on, which actions are triggered, how is the state build.
- We want you to have better devtools to use focus, to have a great Developer Experience.

## What is under the hood

- As in each focus extension, we use a tiny library to  manage the application state called redux.
- Previously we use to have a dispatcher from `flux` library and build state over `EventEmitter`
- Now your state is build with functions and can be build with as many nodes as you need in structure like complex json object.

> You need to read the awesome [Redux](http://redux.js.org/) documentation. At least the concepts.

## Previous concepts

A component `Component = f(state, props)`


## Concepts


## What we rely on

We try to use two concepts
- Providers :A Provider component will provide (as its name says it) informations to all its children via something called the `context`. (We do not encourage you to write any informations in the context by your own). Use the `Providers` instead.
- Connectors: When we use a provider inside a component hierarchy, we try to use a connector to access its information.

## Example

If I have an application
```jsx
import React from 'react';
import {Provider as DomainProvider} from 'focus-redux/behaviours/domain';
import myDomains from './my-app-domains';
const MyApp = props => {
  return <DomainProvider domains={myDomains}>
    <Layout>
          <MyChildComponentWhoNeedsInformationsFromTheDomain name='great tutorial'/>
    </Layout>
  </DomainProvider>
};
```

Where
```jsx
const MyChildComponentWhoNeedsInformationsFromTheDomain = props => {
  return <div>Hello props.domain.TEXT.formatter(props.name)</div>
}
export default connectToDomains(MyChildComponentWhoNeedsInformationsFromTheDomain);
```

## Explainations

Provider(informationsToPassToTheComponentsTree) => Tree => connectToInformations(Child) => The child gets this information in its props.


// todo:

- [] Check the Provider chain presence (form needs metadata)
