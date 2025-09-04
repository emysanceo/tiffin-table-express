import CommunityTabs from "@/components/community/CommunityTabs";

const Community = () => {
  return (
    <div className="min-h-screen py-8 container-padding">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-gradient">Community</h1>
          <p className="text-muted-foreground">Connect, share, and discover with fellow food lovers</p>
        </div>

        {/* Community Tabs */}
        <CommunityTabs />
      </div>
    </div>
  );
};

export default Community;