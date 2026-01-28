"use client";

import { useState } from "react";
import { X, Bell } from "lucide-react";
import { Icon } from "@iconify/react";

interface Notification {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  isRead: boolean;
}

interface NotificationsSidebarProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly notifications?: Notification[];
  readonly onNotificationsChange?: (notifications: Notification[]) => void;
}

export default function NotificationsSidebar({
  isOpen,
  onClose,
  notifications: externalNotifications,
  onNotificationsChange,
}: NotificationsSidebarProps) {
  const [internalNotifications, setInternalNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Admin Role Created",
      timestamp: "21-08-2024 | 09:15 AM",
      description: "A new role, Investment Officer has been created",
      isRead: false,
    },
    {
      id: "2",
      title: "Admin Role Created",
      timestamp: "21-08-2024 | 09:15 AM",
      description: "A new role, Investment Officer has been created",
      isRead: false,
    },
    {
      id: "3",
      title: "Admin Role Created",
      timestamp: "21-08-2024 | 09:15 AM",
      description: "A new role, Investment Officer has been created",
      isRead: false,
    },
    {
      id: "4",
      title: "Admin Role Created",
      timestamp: "21-08-2024 | 09:15 AM",
      description: "A new role, Investment Officer has been created",
      isRead: false,
    },
    {
      id: "5",
      title: "Admin Role Created",
      timestamp: "21-08-2024 | 09:15 AM",
      description: "A new role, Investment Officer has been created",
      isRead: false,
    },
    {
      id: "6",
      title: "Admin Role Created",
      timestamp: "21-08-2024 | 09:15 AM",
      description: "A new role, Investment Officer has been created",
      isRead: false,
    },
    {
      id: "7",
      title: "Admin Role Created",
      timestamp: "21-08-2024 | 09:15 AM",
      description: "A new role, Investment Officer has been created",
      isRead: false,
    },
    {
      id: "8",
      title: "Admin Role Created",
      timestamp: "21-08-2024 | 09:15 AM",
      description: "A new role, Investment Officer has been created",
      isRead: false,
    },
  ]);

  const notifications = externalNotifications || internalNotifications;
  const setNotifications = onNotificationsChange || setInternalNotifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    const updated = notifications.map((notification) => ({ ...notification, isRead: true }));
    setNotifications(updated);
  };

  const handleNotificationClick = (notificationId: string) => {
    const updated = notifications.map((n) =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    setNotifications(updated);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
        style={{ height: "100vh", width: "100vw" }}
      ></div>

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto rounded-l-lg">
        <div>
          {/* Header */}
          <div className="relative flex flex-col items-start gap-[18px] self-stretch py-6 px-5 pb-4 border-b border-neutral-grey-100 bg-primary-red/2">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <h2 className="font-sofia text-base font-normal leading-[145%] text-primary-black">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span 
                    className="flex w-4 h-4 p-0.5 justify-center items-center gap-2 bg-primary-red text-white font-sofia text-[10px] font-normal leading-[14px] overflow-hidden text-ellipsis rounded-full"
                    style={{
                      fontFeatureSettings: "'liga' off, 'clig' off",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                  title="Mark all as read"
                >
                  <Icon icon="hugeicons:tick-double-01" width="24" height="24" />
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="py-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleNotificationClick(notification.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleNotificationClick(notification.id);
                  }
                }}
                tabIndex={0}
                aria-label={`Notification: ${notification.title}`}
              >
                {/* Bell Icon */}
                <div className="shrink-0 mt-1">
                  <div className="relative w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                    <Bell size={16} className="text-primary-red" />
                    {!notification.isRead && (
                      <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-primary-red border-2 border-white"></div>
                    )}
                  </div>
                </div>

                {/* Notification Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3
                        className="text-sm font-normal font-sofia leading-5 tracking-[-0.14px] text-primary-black mb-1"
                        style={{
                          fontFeatureSettings: "'liga' off, 'clig' off",
                        }}
                      >
                        {notification.title}
                      </h3>
                      <p
                        className="text-xs font-normal font-sofia leading-[14px] text-[#818286] mb-1"
                        style={{
                          fontFeatureSettings: "'liga' off, 'clig' off",
                        }}
                      >
                        {notification.timestamp}
                      </p>
                      <p
                        className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-secondary-text"
                        style={{
                          fontFeatureSettings: "'liga' off, 'clig' off",
                        }}
                      >
                        {notification.description}
                      </p>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.isRead && (
                      <div className="shrink-0 mt-1">
                        <div className="w-2 h-2 rounded-full bg-primary-red"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
