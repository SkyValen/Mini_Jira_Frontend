import { useState } from "react";

export const settingHooks = {
    useVisibility: (enable) => {
        const [visible, setVisible] = useState(false);

        if (!enable) {
            return [true, () => {}];
        }

        return [visible, setVisible];
    },
};
