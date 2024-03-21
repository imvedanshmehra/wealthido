import { CommonActions, StackActions, useRoute } from "@react-navigation/native";

let _navigator: { dispatch: (arg0: CommonActions.Action) => void };

/**
 * Sets the top level navigator reference.
 *
 * @param navigatorRef - The navigator reference object.
 * @param navigatorRef.dispatch - The dispatch method of the navigator reference object.
 * @param navigatorRef.dispatch.arg0 - The argument of type CommonActions.Action for the dispatch method.
 *
 * @example
 * import { CommonActions } from "@react-navigation/native";
 *
 * let _navigator: { dispatch: (arg0: CommonActions.Action) => void };
 *
 * function setTopLevelNavigator(navigatorRef: {
 *   dispatch: (arg0: CommonActions.Action) => void;
 * }) {
 *   _navigator = navigatorRef;
 * }
 */
function setTopLevelNavigator(navigatorRef: {
  dispatch: (arg0: CommonActions.Action) => void;
}) {
  _navigator = navigatorRef;
}

/**
 * Navigates to a different screen in a React Native app using the @react-navigation/native library.
 *
 * @param {string} routeName - The name of the screen to navigate to.
 * @param {object} params - Additional parameters to pass to the screen being navigated to.
 * @returns {void}
 */
function navigate(routeName: string, params: object): void {
  _navigator.dispatch(
    CommonActions.navigate({
      name: routeName,
      params,
    })
  );
}

function getCurrentRouteName(): string | undefined {
  const route = useRoute();
  return route.name;
}

/**
 * Resets the navigation stack and navigates to the specified route.
 *
 * @param routeName - The name of the route to navigate to after resetting the stack.
 * @returns None.
 */
function reset(routeName: any) {
  _navigator.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: routeName }],
    })
  );
}

export default {
  navigate,
  reset,
  getCurrentRouteName,
  setTopLevelNavigator,
};
