import { useCallback, useState } from "react";

export function useSet<T>(initialValues: T[] = []) {
	const [set, setSet] = useState<Set<T>>(new Set(initialValues));

	const add = useCallback((item: T) => {
		setSet((prevSet) => new Set([...prevSet, item]));
	}, []);

	const remove = useCallback((item: T) => {
		setSet((prevSet) => {
			const newSet = new Set(prevSet);
			newSet.delete(item);
			return newSet;
		});
	}, []);

	const has = useCallback(
		(item: T) => {
			return set.has(item);
		},
		[set],
	);

	return {
		set,
		add,
		remove,
		has,
	};
}
