export const navItems = [
  {
    name: "Tableau de bord",
    icon: "/assets/icons/dashboard.svg",
    url: "/",
  },
  {
    name: "Documents",
    icon: "/assets/icons/documents.svg",
    url: "/documents",
  },
  {
    name: "Images",
    icon: "/assets/icons/images.svg",
    url: "/images",
  },
  {
    name: "Media",
    icon: "/assets/icons/video.svg",
    url: "/media",
  },
  {
    name: "Autres",
    icon: "/assets/icons/others.svg",
    url: "/others",
  },
];

export const actionsDropdownItems = [
  {
    label: "Rennomer",
    icon: "/assets/icons/edit.svg",
    value: "rename",
  },
  {
    label: "Details",
    icon: "/assets/icons/info.svg",
    value: "details",
  },
  {
    label: "Partgaer",
    icon: "/assets/icons/share.svg",
    value: "share",
  },
  {
    label: "Télécharger",
    icon: "/assets/icons/download.svg",
    value: "download",
  },
  {
    label: "Supprimer",
    icon: "/assets/icons/delete.svg",
    value: "delete",
  },
];

export const sortTypes = [
  {
    label: "Date de création (le plus récent)",
    value: "$createdAt-desc",
  },
  {
    label: "Date de création (le plus ancien)",
    value: "$createdAt-asc",
  },
  {
    label: "Nom (A-Z)",
    value: "name-asc",
  },
  {
    label: "Nom (Z-A)",
    value: "name-desc",
  },
  {
    label: "Taille (le plus grand)",
    value: "size-desc",
  },
  {
    label: "Taille (le plus petit)",
    value: "size-asc",
  },
];

export const avatarUrl =
  "https://thumbs.dreamstime.com/b/avatar-par-d%C3%A9faut-ic%C3%B4ne-profil-vectoriel-m%C3%A9dias-sociaux-utilisateur-portrait-176256935.jpg";

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
