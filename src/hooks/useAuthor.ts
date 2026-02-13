import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthorState } from "@/store";
import { useGetAuthorQuery } from "@/features/author/authorApi";
import { setAuthor } from "@/features/author/authorSlice";

/**
 * Custom hook for author-related operations
 * Provides a clean interface for components to interact with stock state
 */

export function useAuthor() {
  const {
    data: author,
    isLoading: isAuthorLoading,
    error: authorError,
    refetch: refetchAuthor,
  } = useGetAuthorQuery();
  const dispatch = useAppDispatch();
  const authorState = useAppSelector(selectAuthorState);

  useEffect(() => {
    if (author) {
      dispatch(setAuthor(author));
    }
  }, [dispatch, author]);

  const refresh = useCallback(() => {
    refetchAuthor();
  }, [refetchAuthor]);

  return {
    // State
    author: authorState,
    isLoading: isAuthorLoading,
    error: authorError,

    // Actions
    refresh,
  };
}
