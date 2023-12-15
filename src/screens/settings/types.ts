type ProfileHeaderConfig = {
  name: string;
  username: string;
  profileImageUrl: string;
};

type NavHeaderConfig = {
  label: string;
  includeBackButton: boolean;
};

export type SettingsHeaderConfig = {
  profileHeaderConfig?: ProfileHeaderConfig;
  navHeaderConfig?: NavHeaderConfig;
};

export type SettingOptionsConfig = {
  icon: string;
  onPress: () => void;
  label: string;
  logo_circle_color?: string;
  caret?: boolean;
};
