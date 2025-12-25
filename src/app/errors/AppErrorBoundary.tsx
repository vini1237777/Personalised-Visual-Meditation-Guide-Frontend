import React from "react";
import { ERROR_TEXT } from "../../shared/constants/errors.text";

type Props = { children: React.ReactNode };

type State = { hasError: boolean };

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("App crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return <div>{ERROR_TEXT.generic}</div>;
    }
    return this.props.children;
  }
}
