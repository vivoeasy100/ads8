import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type UserProfile = {
  name: string;
  phone: string;
  email: string;
};

type UserProfileContextType = {
  profile: UserProfile | null;
  saveProfile: (data: UserProfile) => void;
  clearProfile: () => void;
  isLoggedIn: boolean;
};

const STORAGE_KEY = "trabalho_justo_perfil";

const UserProfileContext = createContext<UserProfileContextType>({
  profile: null,
  saveProfile: () => {},
  clearProfile: () => {},
  isLoggedIn: false,
});

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setProfile(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const saveProfile = (data: UserProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setProfile(data);
  };

  const clearProfile = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  };

  return (
    <UserProfileContext.Provider value={{ profile, saveProfile, clearProfile, isLoggedIn: !!profile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  return useContext(UserProfileContext);
}
