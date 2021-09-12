# react-concurrent-testing-timers

Explores how to test timer-based actions in React 18.
See ["Planned changes to `act` testing API"](https://github.com/reactwg/react-18/discussions/23#discussioncomment-812450) for more information.

## real timers

Testing real timers currently has a misleading warning.
When letting real timers run, React will issue warnings if an update was not wrapped in act.
However, wrapping the real timer run inside `act()` will only flush the updates when exiting the `act` call.
This makes it impossible to wait for a generic condition e.g. an element to appear.
