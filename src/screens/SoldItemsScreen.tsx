import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../utils/colors';
import { SoldItem } from '../types/api.types';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { useTranslation } from '../hooks/useTranslation';
import { RootStackParamList } from '../navigation/RootNavigator';

type SoldItemsRouteProp = RouteProp<RootStackParamList, 'SoldItems'>;

export const SoldItemsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<SoldItemsRouteProp>();
  const items = route.params?.items ?? [];

  const getMedalColor = (index: number): string => {
    switch (index) {
      case 0:
        return '#FFD700'; // Gold
      case 1:
        return '#C0C0C0'; // Silver
      case 2:
        return '#CD7F32'; // Bronze
      default:
        return colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{t('analytics.soldItems')}</Text>
          <Text style={styles.subtitle}>
            {t('analytics.soldItemsCount', { count: items.length })}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item, index) => (
          <View
            key={item.productName}
            style={[
              styles.itemRow,
              index < items.length - 1 && styles.itemBorder,
            ]}
          >
            <View style={[styles.rankBadge, { backgroundColor: `${getMedalColor(index)}20` }]}>
              <Text style={[styles.rankText, { color: getMedalColor(index) }]}>
                #{index + 1}
              </Text>
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.productName}
              </Text>
              <View style={styles.itemMeta}>
                <Text style={styles.itemQuantity}>
                  {t('format.sold', { count: item.quantitySold })}
                </Text>
                {item.profitMargin != null && (
                  <View style={styles.marginBadge}>
                    <Feather name="trending-up" size={10} color={colors.success} />
                    <Text style={styles.marginText}>
                      {formatPercentage(item.profitMargin)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <Text style={styles.itemRevenue}>
              {formatCurrency(item.totalRevenue)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 13,
    fontWeight: '700',
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemQuantity: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  marginBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.success}15`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  marginText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.success,
  },
  itemRevenue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});

export default SoldItemsScreen;
