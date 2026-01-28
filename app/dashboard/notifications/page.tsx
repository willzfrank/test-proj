"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Check, Bell } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  isRead: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([
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

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const handleClose = () => {
    router.back();
  };

  const handleNotificationClick = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") handleClose();
        }}
        role="button"
        tabIndex={0}
        aria-label="Close notifications"
        style={{ height: "100vh", width: "100vw" }}
      ></div>

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto rounded-l-lg">
        <div>
          {/* Header */}
          <div
            className="flex items-center relative"
            style={{
              padding: "16px 24px 12px 24px",
              borderBottom: "1px solid var(--Neutral-Grey-100, #EEEEF1)",
            }}
          >
            <div className="flex items-center gap-2 flex-1">
              <h2
                className="font-sofia text-lg font-semibold leading-6 tracking-[-0.09px] text-primary-black"
                style={{
                  fontFeatureSettings: "'liga' off, 'clig' off",
                }}
              >
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="bg-[#BB0613] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 absolute right-6">
              <button
                onClick={handleMarkAllAsRead}
                className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                title="Mark all as read"
              >
                <Check size={20} />
              </button>
              <button
                onClick={handleClose}
                className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
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
                role="button"
                tabIndex={0}
                aria-label={`Notification: ${notification.title}`}
              >
                {/* Bell Icon */}
                <div className="shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                    <Bell size={16} className="text-[#BB0613]" />
                  </div>
                </div>

                {/* Notification Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3
                        className="text-xs font-medium font-sofia leading-4 tracking-[-0.12px] text-primary-black mb-1"
                        style={{
                          fontFeatureSettings: "'liga' off, 'clig' off",
                        }}
                      >
                        {notification.title}
                      </h3>
                      <p
                        className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-[#5A607F] mb-1"
                        style={{
                          fontFeatureSettings: "'liga' off, 'clig' off",
                        }}
                      >
                        {notification.timestamp}
                      </p>
                      <p
                        className="text-xs font-normal font-sofia leading-4 tracking-[-0.12px] text-primary-black"
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
                        <div className="w-2 h-2 rounded-full bg-[#BB0613]"></div>
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
