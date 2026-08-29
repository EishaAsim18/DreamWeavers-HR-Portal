import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageContainer } from '@/shared/components/layouts'
import { useAuth } from '@/shared/hooks/use-auth'
import { useIsMobile } from '@/shared/hooks/use-media-query'
import { useChatStore } from '../hooks/use-chat-store'
import { MeetDreamsHero } from '../components/meet-dreams-hero'
import { ChatSidebar } from '../components/chat-sidebar'
import { ChatThread } from '../components/chat-thread'
import { NewChannelModal } from '../components/new-channel-modal'
import { StartDmPicker } from '../components/start-dm-picker'

function ChatSkeleton() {
  return (
    <div className="flex h-full gap-4">
      <div className="hidden w-72 shrink-0 flex-col gap-2 md:flex">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-11 animate-pulse rounded-xl bg-[var(--dw-color-surface-sunken)]" />
        ))}
      </div>
      <div className="flex-1 animate-pulse rounded-2xl bg-[var(--dw-color-surface-sunken)]" />
    </div>
  )
}

export function MeetDreamsPage() {
  const { user } = useAuth()
  const store = useChatStore()
  const isMobile = useIsMobile()
  const [mobileShowThread, setMobileShowThread] = useState(false)

  const handleSelect = (id: string) => {
    store.selectConversation(id)
    if (isMobile) setMobileShowThread(true)
  }

  const showSidebar = !isMobile || !mobileShowThread
  const showThread = !isMobile || mobileShowThread

  return (
    <PageContainer>
      <MeetDreamsHero unreadCount={store.totalUnread} />

      <motion.div
        className="flex overflow-hidden rounded-2xl border border-[var(--dw-color-border-default)] bg-[var(--dw-color-surface-base)] shadow-[var(--dw-shadow-md)]"
        style={{ height: 'calc(100dvh - var(--dw-navbar-height) - 3rem - 76px)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {store.isLoading ? (
          <div className="w-full p-4">
            <ChatSkeleton />
          </div>
        ) : (
          <>
            {showSidebar && (
              <div className="flex w-full shrink-0 flex-col border-r border-[var(--dw-color-border-default)] p-3 md:w-72">
                <ChatSidebar
                  search={store.search}
                  onSearchChange={store.setSearch}
                  channels={store.channels}
                  directMessages={store.directMessages}
                  activeId={store.activeId}
                  currentUserId={user?.id}
                  onSelect={handleSelect}
                  isUnread={store.isUnread}
                  conversationLabel={store.conversationLabel}
                  onNewChannel={() => store.setIsCreateChannelOpen(true)}
                  onNewDm={() => store.setIsStartDmOpen(true)}
                />
              </div>
            )}
            {showThread && (
              <ChatThread
                conversation={store.activeConversation}
                currentUserId={user?.id}
                label={store.activeConversation ? store.conversationLabel(store.activeConversation) : ''}
                isSending={store.isSending}
                onSend={store.sendMessage}
                onBack={isMobile ? () => setMobileShowThread(false) : undefined}
              />
            )}
          </>
        )}
      </motion.div>

      <NewChannelModal
        isOpen={store.isCreateChannelOpen}
        currentUserId={user?.id}
        onClose={() => store.setIsCreateChannelOpen(false)}
        onCreate={store.createChannel}
      />

      <StartDmPicker
        isOpen={store.isStartDmOpen}
        currentUserId={user?.id}
        onClose={() => store.setIsStartDmOpen(false)}
        onSelect={store.startDirectConversation}
      />
    </PageContainer>
  )
}
