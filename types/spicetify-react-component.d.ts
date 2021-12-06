/// <reference path="./spicetify-model.d.ts" />

declare class Button extends Spicetify.ReactComponent.Button {}
declare class Card extends Spicetify.ReactComponent.Card {}
declare class CardWithoutLink extends Spicetify.ReactComponent.CardWithoutLink {}
declare class CircularLoader extends Spicetify.ReactComponent.CircularLoader {}
declare class GlueToggle extends Spicetify.ReactComponent.GlueToggle {}
declare class HeaderBackgroundImage extends Spicetify.ReactComponent.HeaderBackgroundImage {}
declare class HeaderData extends Spicetify.ReactComponent.HeaderData {}
declare class Table extends Spicetify.ReactComponent.Table {}
declare class TableCell extends Spicetify.ReactComponent.TableCell {}
declare class TableHeaderCell extends Spicetify.ReactComponent.TableHeaderCell {}
declare class TableHeaderRow extends Spicetify.ReactComponent.TableHeaderRow {}
declare class TableRow extends Spicetify.ReactComponent.TableRow {}
declare class TrackList extends Spicetify.ReactComponent.TrackList {}

declare namespace Spicetify {
	namespace ReactComponent {
		type ButtonProps = {
			type: "green" | "white" | "red" | "blue" | "gray" | "facebook" | "stroke" | "icon" | "icon-stroke" | "icon-background" | "only-text"
			size?: 16 | 24 | 28 | 32 | 48 | 56
			icon?: Model.Icon
			text?: string
			accessibleText?: string
			texts?: string[]
			accessibleTexts?: string[]
			activeTextIndex?: number
			isDisabled?: boolean
			isActive?: boolean
			isDropTargetActive?: boolean
			isStrongStyle?: boolean
			announceStateChange?: boolean
			logInteraction?: () => void
			onClick?: () => void
			onMouseEnter?: () => void
			onMouseLeave?: () => void
			tooltip?: string
			taId?: string
			interactionId?: string
			interactionIntent?: string
		}
		class Button extends React.PureComponent<ButtonProps> {
			getARIALabel(): string
		}

		type CardProps = {
			trackUri: string
			targetUri?: string
			noButtons?: boolean
			title?: string
			subtitleLinks?: string[]
			description?: string
			metadata?: string
			progress?: number
			isNew?: boolean
			isAdded?: boolean
			showAttentionHighlight?: boolean
			isCurrentUserPlaylist?: boolean
			hideAddButton?: boolean
			hidePlayButton?: boolean
			hideMoreButton?: boolean
			isPlaying?: boolean
			isCurrentPlayerItem?: boolean
			play?: (uri: string, trackUri: string) => void
			forceEnableOverlay?: boolean
			logInteraction?: () => void
		} & CardWithoutLinkProps
		class Card extends React.PureComponent<CardProps> {}

		type CardWithoutLinkProps = {
			uri: string
			seedUri?: string
			imageUrl?: string
			dominantColor?: string
			isContextMenuOpen?: boolean
			onOpenContextMenu?: () => void
			activePageUri?: string
			dragMetadata?: object
		}
		class CardWithoutLink extends React.PureComponent<CardWithoutLinkProps> {}

		type CircularLoaderProps = {
			progress: number
			size: number
		}
		class CircularLoader extends React.PureComponent<CircularLoaderProps> {}

		type GlueToggleProps = {
			isActive?: boolean
			isDisabled?: boolean
			onChange?: (isActive: boolean) => boolean
			labelId?: string
			taId?: string
		}
		class GlueToggle extends React.PureComponent<GlueToggleProps> {}

		type HeaderBackgroundImageProps = {
			imageUrl: string
			scrollBackdropOpacity?: number
			scrollOpacity?: number
		}
		class HeaderBackgroundImage extends React.PureComponent<HeaderBackgroundImageProps> {}

		type HeaderDataProps = {
			backgroundType?: "color" | "image"
			backgroundColor?: string
			backgroundImageUrl?: string
			children?: React.ReactNode
			metaInfo?: React.ReactNode
			label?: string
			title: string | object
			useLargeTitle?: boolean
			enableTitleDragging?: boolean
			uri: string
			seedUri?: string
			imageUrl?: string
			dominantColor?: string
			dragMetadata?: object
			scrollNode?: HTMLElement
			onStickyAdd?: () => void
			onStickyRemove?: () => void
			hideAddButton?: boolean
			hidePlayButton?: boolean
			hideButtons?: boolean
			hideImage?: boolean
			isPlaying?: boolean
			isCurrentPlayerItem?: boolean
			isAdded?: boolean
			isPlayable?: boolean
			activePageUri?: string
			onOpenContextMenu?: () => void
			play?: () => void
		}
		class HeaderData extends React.PureComponent<HeaderDataProps> {}

		type TableProps = {
			clearSelection?: () => void
			onStickyAdd?: () => void
			onStickyRemove?: () => void
			rowHeight?: number
			rowCount?: number
			rowCountScrollerThreshold?: number
			rowIds?: string[]
			rowIdToIndexMap?: Map<string, number>
			resetSelectionOriginAndFocus?: () => void
			renderHeaderRow?: () => React.ReactNode
			renderRow?: (
				rowIndex: number,
				{ useOwnRenderLayer: boolean }
			) => React.ReactNode
			scrollNode?: HTMLElement
			stickyTableHeaderOffsetTop?: number
			sumOfStickyElementHeights?: number
			taId?: string
			isContextMenuOpen?: boolean
		}
		class Table extends React.Component<TableProps> {
			focusRow(rowId: string): void
			scrollToRow(rowId: string, data: { center: boolean }): void
		}

		type TableCellProps = {
			children: React.ReactNode
			extraClassName?: string
			align?: "right" | "center"
			isEmphasized?: boolean
			isSingleLine?: boolean
			isTabularNumber?: boolean
			colSpan?: number
			taId?: string
		}
		class TableCell extends React.PureComponent<TableCellProps> {}

		type TableHeaderCellProps = {
			label: string
			extraClassName?: string
			icon?: Model.Icon
			align?: "right" | "center"
			onSort?: () => void
			sortId?: string
			width?: number
		}
		class TableHeaderCell extends React.PureComponent<TableHeaderCellProps> {}

		type TableHeaderRowProps = {
			extraClassName?: string
			children: React.ReactNode[]
		}
		class TableHeaderRow extends React.PureComponent<TableHeaderRowProps> {}

		type TableRowProps = {
			allRowIds?: string[]
			allRowUris?: string[]
			clearSelection?: () => void
			deselectMultipleRows?: () => void
			deselectSingleRow?: () => void
			dragMetadata?: object
			extraClassName?: string
			focusRow?: () => void
			isAttentionHighlightVisible?: boolean
			isPlayable?: boolean
			isTrackPlaying?: boolean
			isSelected?: boolean
			isHoverForced?: boolean
			listId?: string
			logInteraction?: () => void
			onOpenContextMenu?: () => void
			onMouseEnter?: () => void
			onMouseLeave?: () => void
			onDoubleClick?: () => void
			onEnterPress?: () => void
			rowId?: string
			rowIndex?: number
			rowUri?: string
			scrollToRow?: () => void
			selectionFocusRowId?: string
			selectionOriginRowId?: string
			selectionRowIds?: Map<string, unknown>
			selectMultipleRows?: () => void
			selectSingleRow?: () => void
			taId?: string
			useFixedHeight?: boolean
			useOwnRenderLayer?: boolean
			children: React.ReactNode[]
			selectionOrderedRowUris?: string[]
			a11yLabel?: string
		}
		class TableRow extends React.Component<TableRowProps> {}

		type TrackListProps = {
			scrollNode?: React.ReactNode
			stickyViewId?: string
			stickyElementId?: string
			listUri?: string
			rows?: {
				id: string
				track: Model.Track
				isDiscMarkerRow: boolean
				discNumber: number
			}[]
			showArtistsCell?: boolean
			showDurationCell?: boolean
			showMoreButtonCell?: boolean
			showTrackNumberCell?: boolean
			showPopularityCell?: boolean
			showSaveButtonCell?: boolean
			showTitleCell?: boolean
			onPlayRow?: (data: { rowId: string; reason: string }) => void
			getIsCurrentPlayerTrack: (p1, p2, p3) => boolean
			sumOfStickyElementHeights?: number
			stickyTrackListOffsetTop?: number
			activePageUri?: string
			attentionHighlightRequestId?: number
			attentionHighlightContextUri?: string
			attentionHighlightItemUri?: string
			selectionOrderedRowUris?: string[]
			selectionOrderedRowIds?: string[]
			isContextMenuOpen?: boolean
			isExplicitContentFiltered?: boolean
			playerState?: Model.PlayerState
			onStickyAdd?: () => void
			onStickyRemove?: () => void
			clearSelection?: () => void
			selectSingleRow?: () => void
			openContextMenu?: () => void
			logInteraction?: () => void
		}
		class TrackList extends React.PureComponent<TrackListProps> {
			focusRow(data: { listId: string; rowId: string }): void
			scrollToRow(data: {
				listId: string
				rowId: string
				center: boolean
			}): void
		}
	}
}
