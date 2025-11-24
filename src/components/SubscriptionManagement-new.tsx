import { useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Calendar, CreditCard, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatDate,
  formatCurrency,
  calculateDaysRemaining,
  formatDaysRemaining,
  getSubscriptionStatus,
  getSubscriptionBadgeVariant,
} from "@/lib/utils";

export function SubscriptionManagement() {
  const {
    subscriptionData,
    loading,
    error,
    checkSubscription,
    createCheckout,
  } = useSubscription();
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-8 w-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Crown className="h-5 w-5" />
            Erro na Assinatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={checkSubscription} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleCreateCheckout = async () => {
    setIsCreatingCheckout(true);
    try {
      await createCheckout();
    } catch (error) {
      console.error("Erro ao criar checkout:", error);
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  if (!subscriptionData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Assinatura Premium
          </CardTitle>
          <CardDescription>
            Desbloqueie recursos avançados e tenha controle total das suas
            finanças
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Status: <Badge variant="destructive">Não encontrada</Badge>
            </div>
            <Button
              onClick={handleCreateCheckout}
              disabled={isCreatingCheckout}
              className="w-full"
            >
              <Crown className="h-4 w-4 mr-2" />
              {isCreatingCheckout ? "Criando..." : "Assinar Premium"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const daysRemaining = calculateDaysRemaining(
    subscriptionData.trial_active
      ? subscriptionData.trial_data.trial_end
      : subscriptionData.current_period_end
  );

  const status = getSubscriptionStatus(
    subscriptionData.effective_subscription,
    subscriptionData.trial_active,
    daysRemaining
  );

  const badgeVariant = getSubscriptionBadgeVariant(status);
  const badgeText = formatDaysRemaining(
    daysRemaining,
    subscriptionData.trial_active
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Assinatura Premium
        </CardTitle>
        <CardDescription>
          Gerencie sua assinatura e acompanhe o status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={badgeVariant}>{badgeText}</Badge>
          </div>

          {subscriptionData.trial_active && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Período de Teste:</span>
              <span className="text-sm text-muted-foreground">
                Até {formatDate(subscriptionData.trial_data.trial_end)}
              </span>
            </div>
          )}

          {!subscriptionData.trial_active &&
            subscriptionData.current_period_end && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Próximo Pagamento:</span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(subscriptionData.current_period_end)}
                </span>
              </div>
            )}

          {subscriptionData.subscription_tier && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Plano:</span>
              <span className="text-sm text-muted-foreground">
                {subscriptionData.subscription_tier}
              </span>
            </div>
          )}

          {subscriptionData.amount && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Valor:</span>
              <span className="text-sm text-muted-foreground">
                {formatCurrency(subscriptionData.amount)}
              </span>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            {/* Só mostra o botão de assinar se não estiver ativo */}
            {!subscriptionData.effective_subscription && (
              <Button
                onClick={handleCreateCheckout}
                disabled={isCreatingCheckout}
                className="flex-1"
              >
                <Crown className="h-4 w-4 mr-2" />
                {isCreatingCheckout ? "Criando..." : "Assinar Premium"}
              </Button>
            )}

            <Button onClick={checkSubscription} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
